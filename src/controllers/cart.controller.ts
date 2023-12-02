import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { Cart } from "../models";
import CustomErrorHandler from "../services/CustomErrorHandler";
import { UserDocument } from "../models/user.model";
import Product, { ProductDocument } from "../models/product.model";

const ANONYMOUS_USER_ID = "612e4959345dcc333ac6cb35";
/**
 * @description Populate Product data transform
 * @param {ProductDocument} product - ProductDocument
 * @param {string} _id - string
 * @return {{_id: string, title: string, slug: string, price: number}} {_id: string, title: string, slug: string, price: number}
 */
function transformProduct(doc: ProductDocument, _id: string) {
  return {
    _id,
    title: doc.title,
    slug: doc.slug,
    price: doc.price,
  };
}

function cartPopulate() {
  return [
    {
      path: "user",
      transform: (doc: UserDocument, _id: string) => ({
        _id,
        name: doc.name,
        email: doc.email,
      }),
    },
    {
      path: "products.product",
      transform: transformProduct,
    },
  ];
}

async function getByUserOrCreate(userId: string) {
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate([
        {
          path: "user",
          transform: (doc: UserDocument, _id: string) => ({
            _id,
            name: doc.name,
            email: doc.email,
          }),
        },
        {
          path: "products.product",
          transform: transformProduct,
        },
      ])
      .select("-__v");

    if (cart === null) {
      const instance = await new Cart({
        user: userId,
        products: [],
      });
      const newCard = await instance.save();
      return newCard;
    }
    return cart;
  } catch (err) {
    console.log("Cart get or create err: ", err);
    return null;
  }
}

/**
 * @description Cart Controller
 */
const cartController = {
  /**
   * @description Get login user cart or empty array
   */
  getByUser: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id || ANONYMOUS_USER_ID;
    try {
      const cart = await getByUserOrCreate(userId);
      if (cart === null) {
        res.status(400).json({
          data: null,
          status: 400,
          message: "Failed: Invalue userId",
        });
      }

      res.json({
        status: 200,
        message: "Success, Cart description",
        data: cart,
      });
    } catch (err) {
      return next(err);
    }
  },
  updateByUser: async (req: Request, res: Response, next: NextFunction) => {
    const cartSchema = Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().required(),
      userId: Joi.string(),
    });
    const { error } = cartSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { productId, quantity, userId } = req.body;
    const finalUserId = userId || req.user?._id || ANONYMOUS_USER_ID;
    try {
      const _cart = await getByUserOrCreate(finalUserId);
      if (_cart === null) {
        res.status(400).json({
          data: null,
          status: 400,
          message: "Failed: Invalue userId",
        });
      }
      if (!req.isSuperAdmin) {
        const product = await Product.findById(productId);
        if (product === null) {
          return res.json({
            data: null,
            status: 403,
            message: "Failed, ProductId is invalid",
          });
        }
        const __cart = {
          _id: _cart?._id,
          user: _cart?.user,
          createdAt: _cart?.createdAt,
          updatedAt: _cart?.updatedAt,
          products: [
            {
              product: {
                _id: productId,
                title: product?.title,
                slug: product?.slug,
                price: product?.price,
              },
              quantity,
            },
          ],
        };
        return res.json({
          data: __cart,
          status: 201,
          message: "Success, Product is added to cart",
        });
      }
      let newCart = await Cart.findOneAndUpdate(
        { user: finalUserId, "products.product": productId },
        {
          $set: { "products.$.quantity": quantity },
        },
        { new: true, useFindAndModify: false }
      )
        .populate(cartPopulate())
        .select("-__v");

      // If product is not exists
      if (newCart === null) {
        newCart = await Cart.findOneAndUpdate(
          { user: finalUserId },
          { $addToSet: { products: [{ product: productId, quantity }] } },
          { new: true, useFindAndModify: false }
        )
          .populate(cartPopulate())
          .select("-__v");
      }

      res.status(201).json({
        data: newCart,
        status: 201,
        message: "Success! product update by admin",
      });
    } catch (err) {
      return next(err);
    }
  },
  removeProductByUser: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const cartSchema = Joi.object({
      productId: Joi.string().required(),
      userId: Joi.string(),
    });
    const { error } = cartSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { productId, userId } = req.body;
    try {
      const cart = await getByUserOrCreate(
        userId || req.user?._id || ANONYMOUS_USER_ID
      );
      if (cart === null) {
        res.status(400).json({
          data: null,
          status: 400,
          message: "Failed: Invalue userId",
        });
      }
      if (!req.isSuperAdmin) {
        const newCart = {
          _id: cart?._id,
          user: cart?.user,
          createdAt: cart?.createdAt,
          updatedAt: cart?.updatedAt,
          products: cart?.products?.filter(
            (item) => item.product?._id?.toString() !== productId
          ),
        };

        res.status(202).json({
          data: newCart,
          status: 202,
          message: "Success, Item is added",
        });
      }

      let newCart = await Cart.findOneAndUpdate(
        { user: ANONYMOUS_USER_ID, "products.product": productId },
        {
          $pull: { products: { product: productId } },
        },
        { new: true, useFindAndModify: false }
      )
        .populate(cartPopulate())
        .select("-__v");
      if (newCart === null) {
        return next(
          CustomErrorHandler.badRequest("Product is not found in your cart!")
        );
      }

      res.status(202).json({
        data: newCart,
        status: 202,
        message: "Success! product removed by admin",
      });
    } catch (err) {
      return next(err);
    }

    res.json({ status: 202, message: "product removed" });
  },

  // Admin
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const carts = await Cart.find().populate(cartPopulate()).select("-__v");
      res.json({ status: 200, message: "Success, Cart list", data: carts });
    } catch (err) {
      return next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
      const cart = await Cart.find({ _id: id })
        .populate(cartPopulate())
        .select("-__v");

      if (!cart) {
        return next(CustomErrorHandler.notFound("Cart is not found!"));
      }
      res.json({
        status: 200,
        message: "Success, Cart description",
        data: cart,
      });
    } catch (err) {
      return next(err);
    }
  },
};

export default cartController;
