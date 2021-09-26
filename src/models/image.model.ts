import { Schema, Document, model, HookNextFunction, PopulatedDoc } from 'mongoose';
import fs from 'fs';
import { appRoot } from '../config';
import { ProductDocument } from './product.model';

export interface ImageDocument extends Document {
  name?: string;
  size?: number;
  type?: string;
  dimensions?: string;
  usedCount: number;
  webUrl: string;
}

const ImageSchema = new Schema<ImageDocument>({
  name: { type: String},
  size: { type: Number},
  type: { type: String},
  dimensions: { type: String },
  webUrl: { type: String, required: false, unique: true },
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
});

export default model<ImageDocument>('Image', ImageSchema, 'images');