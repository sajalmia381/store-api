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
 * @returns {{_id: string, title: string, slug: string, price: number}} {_id: string, title: string, slug: string, price: number}
 */
function transformProduct(doc: ProductDocument, _id: string) {
  return {
    _id: doc._id,
    title: doc.title,
    slug: doc.slug,
    price: doc.price,
  };
}

/**
 * @description Populate cart
 * @param {string} _id - string
 * @returns {Array} {user: {_id: string, name:string, email: string}, product: transformProduct}
 */
function cartPopulate() {
  return [
    {
      path: "user",
      transform: (doc: UserDocument, _id: string) => ({
        _id: doc._id,
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
 * @description Logged/Anomyous user specific controller
 */
const userSpecificCartController = {
  /**
   * @description Get login user cart or empty array
   * @PublicApi
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

  /**
   * @description Update product quantity on user cart
   * @Development
   */
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
        const cart = new Cart({
          user: finalUserId,
          products: [
            {
              product: productId,
              quantity,
            },
          ],
        });
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

  /**
   * @description Remove product from user cart
   * @param {string} ProductId - productId is required
   * @param {string?} userId - userId /  req.user?._id
   * @PublicApi
   */
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
    const finalUserID = userId || req.user?._id || ANONYMOUS_USER_ID;

    try {
      if (!req.isSuperAdmin) {
        const cart = await Cart.findOne({
          user: finalUserID,
        })
          .populate(cartPopulate())
          .select("-__v");
        if (cart === null) {
          res.status(400).json({
            data: null,
            status: 400,
            message: userId
              ? "Failed: User ID is invalid"
              : "Cart is not found!",
          });
        }

        const newCart = {
          _id: cart?._id,
          user: cart?.user,
          createdAt: cart?.createdAt,
          updatedAt: cart?.updatedAt,
          products: cart?.products?.filter(
            (item) => item.product?._id?.toString() !== productId
          ),
        };

        return res.status(202).json({
          data: newCart,
          status: 202,
          message: "Success, product removed",
        });
      }
      let newCart = await Cart.findOneAndUpdate(
        { user: finalUserID },
        {
          $pull: { products: { product: productId } },
        },
        { new: true, useFindAndModify: false }
      )
        .populate(cartPopulate())
        .select("-__v");

      res.status(202).json({
        data: newCart,
        status: 202,
        message: "Success! product removed by admin",
      });
    } catch (err) {
      return next(err);
    }
  },
};

/**
 * @description Cart CURD Controller
 */
const cartController = {
  /**
   * @description Get cart list
   * @publicApi
   */
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const carts = await Cart.find().populate(cartPopulate()).select("-__v");
      res.json({ status: 200, message: "Success, Cart list", data: carts });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * @description Create cart
   * @return {Cart} new cart data
   * @PublicApi
   */
  create: async (req: Request, res: Response, next: NextFunction) => {
    const cartSchema = Joi.object({
      userId: Joi.string().required(),
      products: Joi.array().items(
        Joi.object().keys({
          productId: Joi.string().required(),
          quantity: Joi.number().required(),
        })
      ),
    });
    const { error } = cartSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const { userId, products } = req.body;

    try {
      if (!req?.isSuperAdmin) {
        const instance = new Cart({
          user: userId,
          products: products.map((spec: any) => ({
            product: spec.productId,
            quantity: spec.quantity,
          })),
        });
        await instance.populate(cartPopulate()).execPopulate();
        const cart = {
          _id: instance._id,
          user: instance.user,
          products: instance.products,
          createdAt: instance.createdAt,
          updatedAt: instance.updatedAt,
        };
        return res.status(201).json({
          data: cart,
          status: 201,
          message: "Success! Cart created",
        });
      }

      let cart = await Cart.create({
        user: userId,
        products: products.map((spec: any) => ({
          product: spec.productId,
          quantity: spec.quantity,
        })),
      });

      cart = await cart.populate(cartPopulate()).execPopulate();
      res.status(201).json({
        data: cart,
        status: 201,
        message: "Success! cart created by admin",
      });
    } catch (err: any) {
      return next(CustomErrorHandler.badRequest(err));
    }
  },

  /**
   * @description Get single cart description
   * @param {string} _id - cart id
   * @publicApi
   */
  description: async (req: Request, res: Response, next: NextFunction) => {
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

  /**
   * @description Update full cart
   * @param {string} _id - cart id
   * @return {Cart} new cart data
   * @publicApi
   */
  update: async (req: Request, res: Response, next: NextFunction) => {
    const cartSchema = Joi.object({
      products: Joi.array().items(
        Joi.object().keys({
          productId: Joi.string().required(),
          quantity: Joi.number().required(),
        })
      ),
    });
    const { error } = cartSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    try {
      if (!req?.isSuperAdmin) {
        let _cart = await Cart.findById(req.params.id)
          .populate(cartPopulate())
          .select("-__v");
        if (_cart === null) {
          return res
            .status(406)
            .json({ status: 406, message: "Cart is not found!" });
        }

        _cart.products = [];
        _cart = _cart.addProducts(req.body.products);
        _cart = await _cart.populate(cartPopulate()).execPopulate();
        const cart = {
          _id: _cart._id,
          user: _cart.user,
          products: _cart.products,
          createdAt: _cart.createdAt,
          updatedAt: _cart.updatedAt,
        };

        return res.status(201).json({
          data: cart,
          status: 201,
          message: "Success! Cart updated",
        });
      }

      const cart = await Cart.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: {
            products: req.body.products.map((spec: any) => ({
              product: spec.productId,
              quantity: spec.quantity,
            })),
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      )
        .populate(cartPopulate())
        .select("-__v");
      res.status(201).json({
        data: cart,
        status: 201,
        message: "Success! Cart updated by admin",
      });
    } catch (err: any) {
      return next(CustomErrorHandler.serverError(err));
    }
  },

  /**
   * @description Get single cart description
   * @param {string} _id - cart id
   * @publicApi
   */
  destroy: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req?.isSuperAdmin) {
        const instance = await Cart.findOne({ _id: req.params.id });
        if (!instance) {
          return next(CustomErrorHandler.notFound("Cart is not found!"));
        }
        return res.json({ status: 202, message: "Success! cart deleted" });
      }
      const instance = await Cart.findOneAndDelete({ _id: req.params.id });
      if (!instance) {
        return next(CustomErrorHandler.notFound("cart is not found!"));
      }
      return res.json({
        status: 202,
        message: "Success! Product deleted by Admin",
      });
    } catch (err) {
      return next(CustomErrorHandler.serverError());
    }
  },
};

export default {
  ...userSpecificCartController,
  ...cartController,
};
