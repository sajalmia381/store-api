import {
  Document,
  HookNextFunction,
  model,
  PopulatedDoc,
  Schema,
} from "mongoose";
import { ProductDocument } from "./product.model";
import { UserDocument } from "./user.model";

export interface ProductSpecifcation {
  product: PopulatedDoc<ProductDocument & Document>;
  quantity: number;
}

export interface CartDocument extends Document {
  user: PopulatedDoc<UserDocument & Document>;
  products?: [ProductSpecifcation];
  total?: number;
  updatedAt: Date;
  createdAt: Date;
}

export const ProductSpecifcationSchema = new Schema<ProductSpecifcation>(
  {
    product: { type: "ObjectId", ref: "Product"},
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

export const CartSchema = new Schema<CartDocument>(
  {
    user: { type: "ObjectId", ref: "User", unique: true },
    products: [ProductSpecifcationSchema],
    total: { type: Number, required: false },
  },
  { timestamps: true }
);

CartSchema.pre("save", async function name(next: HookNextFunction) {
  let obj = this as CartDocument;
  console.log("pre save", obj);
  return next();
});

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

const Cart = model<CartDocument>("Cart", CartSchema, "carts");

export default Cart;
