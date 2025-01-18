import mongoose, { Schema, Document } from "mongoose";
interface ICourse extends Document
{
  title: string;
  imageUrl: string;
  paymentAmount: number;
  description: string;
  status: string;
}
const CourseSchema = new Schema<ICourse>(
  {
    imageUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    paymentAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
  },
  { timestamps: true }
);

const Course = mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;
export type { ICourse };