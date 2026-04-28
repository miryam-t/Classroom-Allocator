import mongoose from 'mongoose';

const temporaryAllocationSchema = new mongoose.Schema({
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    groupName: { type: String, required: true },
    reason: String,

    // תאריך התחלה: ברירת מחדל היא הרגע שבו נוצר האובייקט (היום)
    startDate: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },

    // תאריך סיום: ברירת מחדל היא הערך של startDate
    endDate: { 
        type: Date, 
        required: true, 
        default: function() {
            return this.startDate; // אם לא הוזן, ייקח את תאריך ההתחלה
        }
    },

    startTime: { type: String, required: true }, 
    endTime: { type: String, required: true },
    lessons: [{ type: Number }]
});

export default mongoose.model('Temporary', temporaryAllocationSchema);