import {
  Document,
  HookNextFunction,
  model,
  PopulatedDoc,
  Schema,
} from "mongoose";
import { ObjectId } from 'mongodb'
import { ProductDocument } from "./product.model";
import { UserDocument } from "./user.model";

type ProductSpecType = {
  productId: string,
  quantity: number
}

export interface IProductSpecifcation {
  product: PopulatedDoc<ProductDocument & Document>;
  quantity: number;
}

export interface ICartDocument extends Document {
  user: PopulatedDoc<UserDocument & Document>;
  products?: IProductSpecifcation[];
  total?: number;
  updatedAt: Date;
  createdAt: Date;
  addProducts: (productSpec: any) => ICartDocument;
}

export const ProductSpecifcationSchema = new Schema<IProductSpecifcation>(
  {
    product: { type: "ObjectId", ref: "Product" },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

export const CartSchema = new Schema<ICartDocument>(
  {
    user: { type: "ObjectId", ref: "User", unique: true },
    products: [ProductSpecifcationSchema],
    total: { type: Number, required: false },
  },
  { timestamps: true }
);

// CartSchema.pre("save", async function name(next: HookNextFunction) {
//   let obj = this as ICartDocument;
//   console.log("pre save", obj);
//   return next();
// });

// CartSchema.statics.getByUserOrCreate = async function (userId: string) {
//   try {
//     const cart: any = await this.findOne({ user: userId })
//       .populate([
//         {
//           path: "user",
//           transform: (doc: UserDocument, _id: string) => ({
//             _id,
//             name: doc.name,
//             email: doc.email,
//           }),
//         },
//         {
//           path: "products.product",
//           transform: (doc: ProductDocument, _id: string) => ({
//             _id,
//             title: doc.title,
//             slug: doc.slug,
//             price: doc.price,
//           }),
//         },
//       ])
//       .select("-__v");

//     if (cart === null) {
//       console.log("create user new cart");
//       const instance = new this({
//         user: userId,
//         products: [],
//       });
//       const newCard = await instance.save();
//       return newCard;
//     }
//     console.log("User old cart found!");
//     return cart;
//   } catch (err) {
//     console.log("err: ", err);
//     return null;
//   }
// }

CartSchema.method("addProducts", function (spec: ProductSpecType[] | ProductSpecType) {
  const cart = this as ICartDocument;

  if (Array.isArray(spec)) {
    const newSpecs = spec.map(
      (item) =>
        new ProductSpecifcation({
          product: new ObjectId(item.productId),
          quantity: item.quantity,
        })
    );
    cart.products?.push(...newSpecs);

  } else {
    const newSpec = new ProductSpecifcation({
      product: new ObjectId(spec.productId),
      quantity: spec.quantity,
    });
    cart.products?.push(newSpec);
  }
  return cart;
});

const ProductSpecifcation = model<IProductSpecifcation>(
  "ProductSpecifcation",
  ProductSpecifcationSchema
);

export default model<ICartDocument>("Cart", CartSchema, "carts");
