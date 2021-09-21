import { Schema, Document, model, HookNextFunction, PopulatedDoc } from 'mongoose';
import fs from 'fs';
import { appRoot } from '../config';

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
  usedCount: { type: Number }
})

// not Work
// ImageSchema.post('remove', function(doc) {
//   console.log('call signal remove image', doc)
//   if(doc?.webUrl) {
//     fs.unlink(`${appRoot}/${doc?.webUrl}`, (err) => {
//       console.log('file removed')
//     });
//   }
// });

export default model<ImageDocument>('Image', ImageSchema, 'images');