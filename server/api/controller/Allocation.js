// import Permanent from '../models/permanentAllocation.js';
// import Temporary from '../models/temporaryAllocation.js';

// // שליפת כל השיבוצים הקבועים לחדר ספציפי
// export const getRoomSchedule = async (req, res) => {
//     try {
//         const { roomId } = req.params;
//         const permanent = await Permanent.find({ classroom: roomId });
//         const temporary = await Temporary.find({ classroom: roomId });
//         res.json({ permanent, temporary });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // הוספת שיבוץ קבוע
// export const addPermanent = async (req, res) => {
//     try {
//         const newAlloc = new Permanent(req.body);
//         await newAlloc.save();
//         res.status(201).json(newAlloc);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };
// // הוספת שיבוץ זמני
// export const addTemporary = async (req, res) => {
//     try {        const newAlloc = new Temporary(req.body);
//         await newAlloc.save();
//         res.status(201).json(newAlloc);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };


// // מחיקת כל השיבוצים לחדר מסוים
// export const clearRoomSchedule = async (req, res) => {
//     try {
//         const { roomId } = req.params;
//         await Permanent.deleteMany({ classroom: roomId });
//         await Temporary.deleteMany({ classroom: roomId });
//         res.json({ message: "המערכת לחדר זה נוקתה בהצלחה" });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
//שניתי את הקוד כדי שיתאים למודל כיתה שם עבור כל כיתה יש כבר מערך שיבוצים-ישפר ביצועים
import Classroom from '../models/Classroom.js';
import Permanent from '../models/permanentAllocation.js';
import Temporary from '../models/temporaryAllocation.js';

// 1. שיפור פונקציית השליפה - שימוש ב-Populate במקום שתי שאילתות נפרדות
export const getRoomSchedule = async (req, res) => {
    try {
        const { roomId } = req.params;
        
        // במקום לחפש ידנית, אנחנו שולפים את החדר ומביאים את כל הנתונים המקושרים שלו
        const classroom = await Classroom.findById(roomId).populate({
            path: 'allocations.allocationId',
            select: '-__v' // מוציא שדות מיותרים של מונגו
        }).lean();

        if (!classroom) return res.status(404).json({ error: "Classroom not found" });

        // מחלקים את התוצאות לזמני וקבוע לנוחות ה-Frontend
        const permanent = classroom.allocations.filter(a => a.onModel === 'Permanent');
        const temporary = classroom.allocations.filter(a => a.onModel === 'Temporary');

        res.json({ permanent, temporary });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 2. הוספת שיבוץ קבוע + עדכון מערך ה-Classroom
export const addPermanent = async (req, res) => {
    try {
        const newAlloc = new Permanent(req.body);
        await newAlloc.save();

        // עדכון אטומי של החדר - דחיפה למערך
        await Classroom.findByIdAndUpdate(req.body.classroom, {
            $push: { 
                allocations: { allocationId: newAlloc._id, onModel: 'Permanent' } 
            }
        });

        res.status(201).json(newAlloc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 3. הוספת שיבוץ זמני + עדכון מערך ה-Classroom
export const addTemporary = async (req, res) => {
    try {
        const newAlloc = new Temporary(req.body);
        await newAlloc.save();

        await Classroom.findByIdAndUpdate(req.body.classroom, {
            $push: { 
                allocations: { allocationId: newAlloc._id, onModel: 'Temporary' } 
            }
        });

        res.status(201).json(newAlloc);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 4. ניקוי לוח זמנים - כולל מחיקת המסמכים וריקון המערך בחדר
export const clearRoomSchedule = async (req, res) => {
    try {
        const { roomId } = req.params;

        // ביצוע כל המחיקות במקביל לביצועים טובים יותר
        await Promise.all([
            Permanent.deleteMany({ classroom: roomId }),
            Temporary.deleteMany({ classroom: roomId }),
            Classroom.findByIdAndUpdate(roomId, { $set: { allocations: [] } }) // ריקון המערך
        ]);

        res.json({ message: "המערכת לחדר זה נוקתה בהצלחה מהטבלאות ומהמערך" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};