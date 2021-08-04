import {Schema, model} from 'mongoose';

export interface RefreshTokenDocument {
  token: string
}

const refreshSchema = new Schema<RefreshTokenDocument>({
  token: { type: String, required: true, unique: true}
})

export default model('RefreshToken', refreshSchema);