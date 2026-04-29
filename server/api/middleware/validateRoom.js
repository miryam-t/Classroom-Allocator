
// בדיקת תקינות מאפייני החדר (קומה, קיבולת ומקרן)
export const validateRoomParams = (req, res, next) => {
    const { floor, capacity, hasProjector } = req.query;
console.log("Query params received:", req.query);
    if (floor && isNaN(Number(floor)))
        return res.status(400).json({ message: 'Floor must be a valid number' });

    if (capacity && Number(capacity) <= 0)
        return res.status(400).json({ message: 'Capacity must be a positive number' });

    if (hasProjector && !['true', 'false'].includes(hasProjector))
        return res.status(400).json({ message: 'hasProjector must be true or false' });

    next();
};