import { Schema, Document, model, HookNextFunction } from 'mongoose';
import slugify from 'slugify';
import Utils from '../services/Utils';

export interface CategoryDocument extends Document {
  name: string;
  slug: string;
  parentId?: string;
}


const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  parentId: { type: String, required: false },
})

CategorySchema.pre('save', async function(next: HookNextFunction) {
  let obj = this as CategoryDocument;
  if (!obj.slug || obj.isModified('slug')) {
    let newSlug = slugify(obj.name)
    const isExist = await Category.exists({slug: newSlug});
    if (isExist) {
      newSlug = newSlug + Utils.getRandomString();
    }
    obj.slug = newSlug;
  }
  return next()
})
const Category = model('Category', CategorySchema, 'categories');

export default Category;