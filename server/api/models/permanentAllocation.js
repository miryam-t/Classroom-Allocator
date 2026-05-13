import mongoose from 'mongoose';

const permanentAllocationSchema = new mongoose.Schema({
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    groupName: { type: String, required: true }, // "ט' 1" או "הקבצה א'"
    subject: String,
    startDate: { 
        type: Date, 
        required: true, 
        default: () => new Date(new Date().getFullYear(), 8, 1) // 01-09
    },
    endDate: { 
        type: Date, 
        required: true, 
        default: () => new Date(new Date().getFullYear() + 1, 5, 30) // 30-06
    },
    // עבור שיבוץ קבוע יש צורך בהגדרת יום או שעה, לכן נוסיף שדות אלו
    day: { 
        type: String, 
        required: true, 
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] 
    },
    startTime: { type: String, required: true }, // תחילת הבלוק
    endTime: { type: String, required: true },   // סוף הבלוק
    
    // מערך שיעורים לסנכרון אוטומטי יתכן ויהיה ריק עבור שעות שלאחר גמר הלימודים
    lessons: [{ type: Number,required: false }]
});

export default mongoose.model('Permanent', permanentAllocationSchema);