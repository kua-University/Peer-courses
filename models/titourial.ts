import mongoose from 'mongoose';

const TutorialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    courseId: { type: String, ref: 'Course', required: true },
    contentType: { type: String, required: true },
    contentUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Tutorial || mongoose.model('Tutorial', TutorialSchema);
