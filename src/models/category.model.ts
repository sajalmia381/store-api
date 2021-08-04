import { Schema, Document, model, HookNextFunction } from 'mongoose';
import slugify from 'slugify';

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
  let category = this as CategoryDocument;
  if (!category.slug || category.isModified('slug')) {
    let newSlug = slugify(category.name)
    category.slug = newSlug
  }
  return next()
})


export default model('Category', CategorySchema, 'categories')