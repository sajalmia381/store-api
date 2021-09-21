import { Schema, Document, model, PopulatedDoc, HookNextFunction } from 'mongoose';
import slugify from 'slugify';
import Utils from '../services/Utils';
import { CategoryDocument } from './category.model';

import { UserDocument } from './user.model';


export interface ProductDocument extends Document {
  createBy: PopulatedDoc<UserDocument & Document>,
  title: string;
  slug: string;
  price: number;
  image: string;
  category?: PopulatedDoc<CategoryDocument & Document>,
  description?: string;
  updatedAt: Date;
  createdAt: Date;
}


const ProductSchema = new Schema<ProductDocument>({
  createBy: { type: 'ObjectId', ref: 'User' },
  title: { type: String, required: true },
  slug: { type: String, required: false, unique: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: { type: String, required: false },
  category: { type: 'ObjectId', ref: 'Category' },
}, { timestamps: true })

ProductSchema.pre('save', async function(next: HookNextFunction) {
  let obj = this as ProductDocument;
  if (!obj.slug || obj.isModified('title')) {
    let newSlug = slugify(obj.title, { lower: true })
    const isExist = await Product.exists({slug: newSlug});
    if (isExist) {
      newSlug = newSlug + '-' + Utils.getRandomString();
    }
    obj.slug = newSlug;
  }
  return next()
});

ProductSchema.post('remove', function(doc) {
  console.log('%s has been removed', doc._id);
  if(doc?.image) {
    // const imagePath = instance.image;
			// if (imagePath) {
			// 	fs.unlink(`${appRoot}/${imagePath}`, (err) => {
			// 		if (err) {
			// 				return next(CustomErrorHandler.serverError());
			// 		}
					
			// 	});
			// }
  }
});

const Product = model<ProductDocument>('Product', ProductSchema, 'products');
export default Product;