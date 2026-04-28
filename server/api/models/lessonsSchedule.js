import mongoose from 'mongoose';

const lessonScheduleSchema = new mongoose.Schema({
    lessonNumber: { type: Number, required: true, unique: true }, // 1, 2, 3...
    startTime: { type: String, required: true }, // "08:00"
    endTime: { type: String, required: true }    // "08:45"
});

export default mongoose.model('LessonSchedule', lessonScheduleSchema);