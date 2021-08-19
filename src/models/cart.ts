import { Document, HookNextFunction, model, PopulatedDoc, Schema } from "mongoose";
import { ProductDocument } from "./product.model";
import { UserDocument } from "./user.model";

export interface CartDocument extends Document {
  user: PopulatedDoc<UserDocument & Document>;
  products: [PopulatedDoc<ProductDocument & Document>];
  total?: number;
  updatedAt: Date;
  createdAt: Date;
}

export const CartSchema = new Schema<CartDocument>({
  user: { type: 'ObjectId', ref: "User" },
  products: [{type: 'objectId', ref: 'Product'}],
  total: { type: Number }
}, { timestamps: true })

CartSchema.pre('save', async function name(next: HookNextFunction) {
  let obj = this as CartDocument;
  return next()
})


export default model<CartDocument>('Cart', CartSchema, 'carts')