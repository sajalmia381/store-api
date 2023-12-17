import { PopulatedDoc, Schema, model } from "mongoose";
import { UserDocument } from "./user.model";

type DoneStatus = "CANCELLED" | "COMPLETED";

export function isCompleteStatus(value: string): boolean {
  return ["CANCELLED", "COMPLETED"].includes(value)
}

export type TodoStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | DoneStatus;

export interface TodoDocument extends Document {
  createdBy: PopulatedDoc<UserDocument & Document>;
  title: string;
  description?: string;
  completed: boolean;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TodoScheme = new Schema<TodoDocument>(
  {
    createdBy: { type: "ObjectId", ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: { type: String, required: true },
    completed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export default model<TodoDocument>("Todo", TodoScheme, "todos");
