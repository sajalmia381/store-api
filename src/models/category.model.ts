import { Schema, Document, model, HookNextFunction, PopulatedDoc } from 'mongoose';
import slugify from 'slugify';
import Utils from '../services/Utils';
import { ProductDocument } from './product.model';

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  parent?: PopulatedDoc<'self' & Document>;
  // products: PopulatedDoc<ProductDocument & Document>[];
}

const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: false, unique: true },
  parent: { type: 'ObjectId', ref: 'Category' },
  // products: [{ type: 'ObjectId', ref: 'Product' }],
})

CategorySchema.pre('save', async function(next: HookNextFunction) {
  let obj = this as CategoryDocument;
  if (!obj.slug || obj.isModified('name')) {
    let newSlug = slugify(obj.name, { lower: true })
    const isExist = await Category.exists({slug: newSlug});
    if (isExist) {
      newSlug = newSlug + Utils.getRandomString();
    }
    obj.slug = newSlug;
  }
  return next()
})
const Category = model<CategoryDocument>('Category', CategorySchema, 'categories');

export default Category;