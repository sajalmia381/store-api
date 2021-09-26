import { Schema, Document, model, PopulatedDoc, HookNextFunction } from 'mongoose';
import slugify from 'slugify';
import Utils from '../services/Utils';
import { CategoryDocument } from './category.model';
import { ImageDocument } from './image.model';
import { Image } from '../models';
import { UserDocument } from './user.model';
import  fs from 'fs';
import { appRoot } from '../config';

export interface ProductDocument extends Document {
  createBy: PopulatedDoc<UserDocument & Document>,
  title: string;
  slug: string;
  price: number;
  image: string;
  imageSource?: PopulatedDoc<ImageDocument & Document>,
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
  imageSource: { type: 'ObjectId', ref: 'Image'},
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
  if (obj?.imageSource) {
    let imageItem = await Image.findOne({_id: obj.imageSource })
    if (imageItem) {
      console.log('image item', imageItem)
      obj.image = imageItem.webUrl
    }
  }
  return next()
});

ProductSchema.post('findOneAndDelete', async function(doc) {
  // console.log('%s has been removed', doc._id);
  // if (product?.image) {
    // const imagePath = instance.image;
			// if (imagePath) {
			// 	fs.unlink(`${appRoot}/${imagePath}`, (err) => {
			// 		if (err) {
			// 				return next(CustomErrorHandler.serverError());
			// 		}
					
			// 	});
			// }
  // }
  if (doc?.imageSource) {
    await Image.findOneAndDelete({ _id: doc.imageSource })
  } else if (doc.image) {
    try {
      const image = await Image.findOneAndDelete({ webUrl: doc.image })
      if (!image) {
        fs.unlink(`${appRoot}/${doc.image}`, (err) => {
          if (err) {
            console.log(' image file not delete')
          }
        });
      }
    } catch (err) {
      console.log('image error')
    }
  }
});

const Product = model<ProductDocument>('Product', ProductSchema, 'products');
export default Product;