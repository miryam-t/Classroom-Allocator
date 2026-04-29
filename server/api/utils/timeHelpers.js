
export const validDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const isValidTime = (time) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

// פונקציית עזר להמרת שעה לדקות
export const timeToMinutes = (time) => {
    if (!time || typeof time !== 'string') return null;
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes;
};

// השוואת תאריכים בטוחה ב-UTC — מונעת בעיות timezone
export const isSameDate = (d1, d2) => (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
);

// בדיקת ביטול
export const isCancelledForSlot = (cancellations, requestedDate, startTime, endTime) => {
    return cancellations.some(c => {
        const cancelDate = new Date(c.date);
        //לא תלוי בשרת
        if (!isSameDate(cancelDate, requestedDate)) return false;

        // ביטול ליום שלם
        if (!c.startTime || !c.endTime) return true;

        // ביטול חלקי — בדיקת חפיפת שעות
        return (
            timeToMinutes(startTime) < timeToMinutes(c.endTime) &&
            timeToMinutes(endTime) > timeToMinutes(c.startTime)
        );
    });
};

export const getSchoolDay = (date) => {
    const day = validDays[date.getDay()];
    return day ?? null; // שבת מחזיר null במפורש
};