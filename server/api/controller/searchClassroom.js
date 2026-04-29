import Classroom from '../models/Classroom.js';
import { timeToMinutes, validDays,isSameDate,isCancelledForSlot, getSchoolDay  } from '../utils/timeHelpers.js';

export const searchAvailableClassrooms = async (req, res) => {
    try {
        const {
            floor,
            building,
            capacity,
            hasProjector,
            day,
            startTime,
            endTime,
            date,
            isTemporary
        } = req.query;

        //  הכנת ערכים בסיסיים
        // יצירת Date פעם אחת — ימנע יצירות מרובות בהמשך
        const requestedDate = date ? new Date(date) : null;

        // גזירת יום מתאריך אם לא הוזן — עם בדיקת שבת
        const effectiveDay = day || (requestedDate ? getSchoolDay(requestedDate) : null);
        
        // בדיקה שהיום תקין (לא שבת)
        if (requestedDate && !effectiveDay && (startTime || endTime))
            return res.status(400).json({ 
                message: 'Date provided is not a valid school day' 
            });

        //  ---- בניית פילטר בסיסי----------
        const filter = {};
        if (floor) filter.floor = Number(floor);
        if (building) filter.building = building;
        if (capacity) filter.capacity = { $gte: Number(capacity) };
        if (hasProjector && hasProjector !== '') filter.hasProjector = hasProjector === 'true';

        // populate עם select — שולף רק שדות נדרשים לביצועים טובים יותר
        // lean — 
        // שימוש ב-lean() כדי לקבל אובייקט JavaScript פשוט (POJO) במקום מסמך Mongoose כבד.
        // זה משפר את הביצועים (מהירות) וחוסך בזיכרון כי אנחנו רק צריכים לקרוא את הנתונים ולא לשנות אותם.
        let classrooms = await Classroom.find(filter)
            .populate({
                path: 'allocations.allocationId',
                select: 'day startTime endTime startDate endDate'
            })
            .sort({ capacity: 1 })
            .lean();

        // יציאה מוקדמת אם אין חדרים בכלל
        if (classrooms.length === 0)
            return res.status(404).json({ message: 'No available classrooms found' });

        //   ------- סינון לפי זמינות-------------
        if (effectiveDay && startTime && endTime) {
            classrooms = classrooms.filter(classroom => {

                const isBusy = classroom.allocations.some(({ allocationId, onModel }) => {

                    if (!allocationId) {
                        console.warn(`Orphaned allocation in classroom ${classroom._id}`);
                        return false;
                    }

                    // בדיקת חפיפת שעות — זהה לשני סוגי השיבוץ
                    const allocStart = timeToMinutes(allocationId.startTime);
                    const allocEnd = timeToMinutes(allocationId.endTime);
                    if (allocStart === null || allocEnd === null) return false;

                    const hasTimeOverlap = (
                        timeToMinutes(startTime) < allocEnd &&
                        timeToMinutes(endTime) > allocStart
                    );
                    if (!hasTimeOverlap) return false;


                    // Permanent — בדיקה לפי יום

                    if (onModel === 'Permanent') {
                        if (allocationId.day !== effectiveDay) return false;

                        // בדיקת ביטול — האם מכסה את השעות המבוקשות?
                        if (requestedDate) {
                            const isCancelled = isCancelledForSlot(
                                classroom.cancellations,
                                requestedDate,
                                startTime,
                                endTime
                            );
                            // אם בוטל — החדר פנוי
                            if (isCancelled) return false;
                        }

                        return true;
                    }

                    // Temporary — בדיקה לפי תאריך

                    if (onModel === 'Temporary') {
                        if (!requestedDate) return false;

                        const isInDateRange = (
                            requestedDate >= new Date(allocationId.startDate) &&
                            requestedDate <= new Date(allocationId.endDate)
                        );

                        // בדיקה שהיום בשבוע תואם — Temporary שנקבע לימי שני לא תופס ביום שלישי
                        const isDaySame = !allocationId.day || allocationId.day === effectiveDay;
                        return isInDateRange && isDaySame;
                    }

                    return false;
                });

                return !isBusy;
            });
        }

        //--------------הגנה על שיבוץ קבוע---------
         // לא להציע חדרים שפנויים רק בגלל ביטול זמני
        if (isTemporary === 'false' && requestedDate) {
            classrooms = classrooms.filter(classroom => {
                const isOnlyTemporarilyFree = isCancelledForSlot(
                    classroom.cancellations,
                    requestedDate,
                    startTime,
                    endTime
                );
                return !isOnlyTemporarilyFree;
            });
        }

        // שלב 6 – Pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const paginated = classrooms.slice((page - 1) * limit, page * limit);

        //-----– החזרת תוצאות-------
        // אם אין תוצאות לאחר כל הסינונים, נחזיר שגיאת 404
        if (paginated.length === 0)
            return res.status(404).json({ message: 'No available classrooms found' });

        // החזרת התוצאות עם מידע על הדפדוף (Pagination Metadata)
        // המידע עוזר לצד הלקוח לדעת כמה תוצאות יש סה"כ ואיזה דף מוצג כרגע
        res.json({
            total: classrooms.length,
            page,
            results: paginated
        });

    } catch (err) {
        // לא חושפים פרטים פנימיים בפרודקשן
        console.error('searchAvailableClassrooms error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

