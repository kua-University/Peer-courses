// models/user.ts
import mongoose, { Schema, Document, Types } from "mongoose";

interface IUser extends Document
{
  email: string;
  unlockedCourses: Types.ObjectId[]; // Array of course references
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  unlockedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // References to Course
});

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
export type { IUser };
