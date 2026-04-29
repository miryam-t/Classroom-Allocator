import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    floor: { type: Number, required: true },
    building: { type: String, default: 'Main' },
    capacity: { type: Number, required: true },
    hasProjector: { type: Boolean, default: false },
    
    // מערך השיבוצים - באחריות ציפורה
    allocations: [{ 
        day: String, 
        startTime: String, 
        endTime: String, 
        courseName: String 
    }],
    
    // מערך הביטולים -משימה 3 בדאטה - ציפורה - כאן השינוי שלך בא לידי ביטוי (DATA)
    cancellations: [{ 
        // ...תאריך הביטול חייבים למלא כי לדעת שעות בלי תאריך זה חסר משמעות
        date: { type: Date, required: true }, 
        
        // --- שינוי: הוספת שדות זמן ---
        //השדות האלו קריטיים כדי שהמערכת תדע "לשחרר" את החדר בשעות ספציפיות
        //ולא רק לפי תאריך
        startTime: { type: String, required: true }, // למשל: "08:50"
        endTime: { type: String, required: true },   // למשל: "09:35"
        
        reason: { type: String }, // סיבת הביטול (אופציונלי)
        
        // --- בונוס: קישור לשיבוץ המקורי ---
        // עוזר למערכת לדעת איזה קורס בוטל בתוך הבלוק הזה
        originalCourseName: String 
    }]
});

export default mongoose.model('Classroom', classroomSchema);