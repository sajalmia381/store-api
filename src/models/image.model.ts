import { Schema, Document, model, HookNextFunction, PopulatedDoc, ObjectId } from 'mongoose';
import fs from 'fs';
import { appRoot } from '../config';
import { ProductDocument } from './product.model';
import { Product } from '.';

export interface ImageDocument extends Document {
  name?: string;
  size?: number;
  type?: string;
  dimensions?: string;
  product?: {type: 'ObjectId', ref: "Product"};
  webUrl: string;
}

const ImageSchema = new Schema<ImageDocument>({
  name: { type: String},
  size: { type: Number},
  type: { type: String},
  dimensions: { type: String },
  product: { type: String, required: false, unique: true },
  webUrl: { type: String },
})

ImageSchema.post('findOneAndDelete', async function(imageDoc) {
  if(imageDoc?.webUrl) {
    fs.unlink(`${appRoot}/${imageDoc?.webUrl}`, (err) => {
      if(err) {
        console.log('Remove image error')
      }
    });
  }
  if(imageDoc.product) {
    await Product.updateOne({_id: imageDoc.product}, { imageSource: null, image: '' })
  }
});

export default model<ImageDocument>('Image', ImageSchema, 'images');