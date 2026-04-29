import Classroom from '../models/Classroom.js';

export const getById = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) return res.status(404).json({ message: 'Classroom not found' });
        res.json(classroom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const createClassroom = async (req, res) => {
    const { number, name, floor, building, capacity, hasProjector } = req.body;

    // וולידציה: בדיקה אם החדר רגיל (לא מחשבים)
    if (!name.includes('מחשבים') && !name.includes('computers')) {
        const firstDigit = number.toString().charAt(0); 
        
        if (firstDigit !== floor.toString()) {
            return res.status(400).json({ 
                message: `הספרה הראשונה (${firstDigit}) חייבת להתאים לקומה (${floor})` 
            });
        }
    }

    try {
        const newClassroom = new Classroom(req.body);
        await newClassroom.save();
        res.status(201).json(newClassroom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateClassroom = async (req, res) => {
    try {
        const updatedClassroom = await Classroom.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClassroom) return res.status(404).json({ message: 'Classroom not found' });
        res.json(updatedClassroom);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteClassroom = async (req, res) => {
    try {
        const deletedClassroom = await Classroom.findByIdAndDelete(req.params.id);
        if (!deletedClassroom) return res.status(404).json({ message: 'Classroom not found' });
        res.json({ message: 'Classroom deleted', deletedClassroom });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- הוספת ביטול חד-פעמי לפי ההערות החדשות של ציפורה---

/**
 * פונקציה להוספת ביטול למערך הביטולים של חדר ספציפי
 * עדכון לפי "ביטול חכם ופירוק בלוקים" ח 
 */
export const addCancellation = async (req, res) => {
    const { id } = req.params; // ה-ID של החדר
    
    //לוגיקת החיפוש הדו-כיוונית
    // שימוש ב-startTime ו-endTime 
    // כדי לאפשר למערכת לתרגם "מספר שיעור" לזמן אמת
    const { date, startTime, endTime, reason } = req.body; 

    try {
        // מציאת החדר ועדכון מערך ה-cancellations שלו
        // ביטול חכם: המערכת לא מוחקת, אלא "משכפלת" את נתוני הביטול לתוך מערך ה-cancellations
        const updatedClassroom = await Classroom.findByIdAndUpdate(
            id,
            { 
                $push: { 
                    cancellations: { 
                        date, 
                        startTime, // הוספת שעת התחלה מדויקת לביטול בלוק/חלק מבלוק
                        endTime,   // הוספת שעת סיום מדויקת
                        reason 
                    } 
                } 
            },
            { new: true, runValidators: true } 
        );

        if (!updatedClassroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        res.status(200).json({ 
            message: 'הביטול התווסף בהצלחה למערכת החריגות', 
            updatedClassroom 
        });
    } catch (err) {
        res.status(500).json({ message: 'שגיאה בהוספת הביטול: ' + err.message });
    }
};