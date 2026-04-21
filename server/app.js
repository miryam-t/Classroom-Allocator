const cors = require('cors'); // למעלה עם ה-require
const express = require('express');
const app = express();
const port = 3000;

app.use(cors()); 
app.get('/', (req, res) => {
  res.send('Server is running!');
});
//רק לצורך בדיקה
//רשימה דמיונית שאחרי זה נשים במסד
app.get('/api/classrooms', (req, res) => {
  const classrooms = [
    { _id: '1', name: 'כיתה א1', floor: '1', capacity: 30 },
    { _id: '2', name: 'מעבדת מחשבים', floor: '2', capacity: 20 },
    { _id: '3', name: 'אודיטוריום', floor: '0', capacity: 100 }
  ];
  res.json(classrooms);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});