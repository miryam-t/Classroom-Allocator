
require('dotenv').config();
const cors = require('cors'); // למעלה עם ה-require
const mongoose = require('mongoose');
const Classroom = require('./api/models/Classroom'); // ייבוא המודל
const express = require('express');
const app = express();
const port = 3000;
//פתרון בעיית הcors
app.use(cors()); 
// חיבור למסד הנתונים
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('connect to mongoDB');
    })
    .catch(error => {
        console.error(error);
    })


app.get('/', (req, res) => {
  res.send('Server is running!');
});


app.get('/api/classrooms', async (req, res) => {
    try {
        const classrooms = await Classroom.find(); // שליפה אמיתית מהמסד!
        res.json(classrooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});