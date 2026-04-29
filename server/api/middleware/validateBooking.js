
// בדיקת תקינות תאריך וסוג שיבוץ (זמני/קבוע)
export const validateBookingParams = (req, res, next) => {
    const { date, isTemporary } = req.query;
console.log("Query params received:", req.query);
    if (isTemporary && !['true', 'false'].includes(isTemporary))
        return res.status(400).json({ message: 'isTemporary must be true or false' });

    if (date && isNaN(new Date(date).getTime()))
        return res.status(400).json({ message: 'Invalid date format' });

    next();
};