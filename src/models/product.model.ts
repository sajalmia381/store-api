import { Schema, Document, model, PopulatedDoc, HookNextFunction } from 'mongoose';
import slugify from 'slugify';

import { UserDocument } from './user.model';


export interface ProductDocument extends Document {
  createBy: PopulatedDoc<UserDocument & Document>,
  title: string;
  slug: string;
  price: number;
  images: string;
  // categroy: foreign_Key
  description?: string;
  updatedAt: Date;
  createdAt: Date;
}


const ProductSchema = new Schema<ProductDocument>({
  createBy: { type: 'ObjectId', ref: 'User' },
  title: { type: String, required: true },
  slug: { type: String, required: false, unique: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: false },
}, { timestamps: true })

ProductSchema.pre('save', async function(next: HookNextFunction) {
  let product = this as ProductDocument;
  if (product.isModified("title") || !product.slug) {
    let slug = slugify(product.title, { lower: true });
    product.slug = slug
  }
  return next()
});

export default model('Product', ProductSchema, 'products')