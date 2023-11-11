import { PopulatedDoc, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";

export interface TodoDocument extends Document {
  createdBy: PopulatedDoc<UserDocument & Document>;
  title: string;
  completed: boolean;
  createdAt: Date;
}

const TodoScheme = new Schema<TodoDocument>(
  {
    createdBy: { type: "ObjectId", ref: "User" },
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default model<TodoDocument>("Todo", TodoScheme, "todos");
