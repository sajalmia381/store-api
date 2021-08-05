import { Schema, Document, model, PopulatedDoc, HookNextFunction } from 'mongoose';
import slugify from 'slugify';
import Utils from '../services/Utils';

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
  let obj = this as ProductDocument;
  if (!obj.slug || obj.isModified('slug')) {
    let newSlug = slugify(obj.title)
    const isExist = await Product.exists({slug: newSlug});
    if (isExist) {
      newSlug = newSlug + '-' + Utils.getRandomString();
    }
    obj.slug = newSlug;
  }
  return next()
});
const Product = model('Product', ProductSchema, 'products');
export default Product;