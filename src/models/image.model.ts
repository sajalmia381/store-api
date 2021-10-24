import { Schema, Document, model, HookNextFunction, PopulatedDoc, ObjectId } from 'mongoose';
import fs from 'fs';
import { appRoot } from '../config';
import { Product } from '.';

export interface ImageDocument extends Document {
  name?: string;
  size?: number;
  type?: string;
  dimensions?: string;
  webUrl: string;
  usedCount: number
}

const ImageSchema = new Schema<ImageDocument>({
  name: { type: String},
  size: { type: Number},
  type: { type: String},
  dimensions: { type: String },
  webUrl: { type: String },
  usedCount: { type: Number },
})

ImageSchema.post('findOneAndDelete', async function(imageDoc) {
  if(imageDoc?.webUrl) {
    fs.unlink(`${appRoot}/${imageDoc?.webUrl}`, (err) => {
      if(err) {
        console.log('Remove image error')
      }
    });
  }
  try {
    await Product.updateMany({ imageSource: imageDoc._id }, { imageSource: null, image: '' }).exec()
  } catch (_) {}
});

export default model<ImageDocument>('Image', ImageSchema, 'images');