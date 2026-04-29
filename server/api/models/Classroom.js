// import mongoose from 'mongoose';

// const classroomSchema = new mongoose.Schema({
//     number: { type: Number, required: true, unique: true },
//     name: { type: String, required: true },
//     floor: { type: Number, required: true },
//     building: { type: String, default: 'Main' },
//     capacity: { type: Number, required: true },
//     hasProjector: { type: Boolean, default: false },
    
//     // מערך השיבוצים - באחריות ציפורה
//     allocations: [{ 
//         day: String, 
//         startTime: String, 
//         endTime: String, 
//         courseName: String 
//     }],
    
//     // מערך הביטולים -משימה 3 בדאטה - ציפורה - כאן השינוי שלך בא לידי ביטוי (DATA)
//     cancellations: [{ 
//         // ...תאריך הביטול חייבים למלא כי לדעת שעות בלי תאריך זה חסר משמעות
//         date: { type: Date, required: true }, 
        
//         // --- שינוי: הוספת שדות זמן ---
//         //השדות האלו קריטיים כדי שהמערכת תדע "לשחרר" את החדר בשעות ספציפיות
//         //ולא רק לפי תאריך
//         startTime: { type: String, required: true }, // למשל: "08:50"
//         endTime: { type: String, required: true },   // למשל: "09:35"
        
//         reason: { type: String }, // סיבת הביטול (אופציונלי)
        
//         // --- בונוס: קישור לשיבוץ המקורי ---
//         // עוזר למערכת לדעת איזה קורס בוטל בתוך הבלוק הזה
//         originalCourseName: String 
//     }]
// });

// export default mongoose.model('Classroom', classroomSchema);
import mongoose from 'mongoose';

const classroomSchema = new mongoose.Schema({
    number: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    floor: { type: Number, required: true },
    building: { type: String, default: 'Main' },
    capacity: { type: Number, required: true },
    hasProjector: { type: Boolean, default: false },
    
    // --- משימה של מישהי אחרת: הגדרת שיבוצים ---
    // אני לא נוגעת במבנה הפנימי של המערך הזה כדי לא לדרוס עבודה של חברה
    allocations: [{ 
        day: String, 
        startTime: String, 
        endTime: String, 
        courseName: String 
    }],
    
    // --- המשימה הכחולה שלי: הגדרת סכמת ביטול חד פעמי ---
    // שינוי על פי הוראות התכנון החדשות: הוספת שעות התחלה וסיום לדיוק מקסימלי
    cancellations: [{ 
        // תאריך היום שבו חל הביטול
        date: { type: Date, required: true }, 
        
        // על פי סעיף "לוגיקת חיפוש דו-כיוונית": המערכת חייבת זמן מדויק (שעון)
        // השינוי מאפשר למזכירה לבטל רק חלק מהיום או שיעור בודד
        startTime: { type: String, required: true }, // דוגמה: "10:00"
        endTime: { type: String, required: true },   // דוגמה: "11:30"
        
        reason: { type: String }, // סיבת הביטול (למשל: "טיול שנתי")
        
        // קישור פנימי לשיבוץ הקבוע שבוטל (אופציונלי)
        originalScheduleRef: { type: mongoose.Schema.Types.ObjectId }
    }]
});

export default mongoose.model('Classroom', classroomSchema);