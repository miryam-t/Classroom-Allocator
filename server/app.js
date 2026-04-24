import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// ייבוא הראוטר והמודל בפורמט החדש
import classroomRouter from './api/routes/classroom.js';
import Classroom from './api/models/Classroom.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // חשוב: מאפשר לשרת לקרוא JSON מה-body

// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Connection error:', error));

app.get('/', (req, res) => {
    res.send('Server is running with ES Modules!');
});

// שימוש בראוטר
app.use('/api', classroomRouter);

// שליפת כל הכיתות (נשאר ב-app.js לפי הקוד המקורי שלכן)
app.get('/api/classrooms', async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.json(classrooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});