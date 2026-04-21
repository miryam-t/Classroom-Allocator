const cors = require('cors'); // למעלה עם ה-require
const mongoose = require('mongoose');
const Classroom = require('./models/Classroom'); // ייבוא המודל
const express = require('express');
const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/classroom_db')
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors()); 
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