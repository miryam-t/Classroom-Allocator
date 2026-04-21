import React, { useState, useEffect } from 'react';
import axios from 'axios'; // כלי נפוץ לשליפת נתונים

const ClassroomList = () => {
    const [classrooms, setClassrooms] = useState([]); // כאן יישמרו הכיתות
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // פונקציה שפונה לשרת שלך
        const fetchData = async () => {
            try {
                // שימי לב: הכתובת צריכה להתאים לפורט של השרת שלך (למשל 5000 או 3000)
                const response = await axios.get('http://localhost:3000/api/classrooms');
                setClassrooms(response.data);
                setLoading(false);
            } catch (error) {
                console.error("שגיאה בשליפת נתונים:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>טוען כיתות...</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>רשימת כיתות מהמסד</h1>
            <ul>
                {classrooms.map((room) => (
                    <li key={room._id}>
                        {room.name} - קומה: {room.floor} (קיבולת: {room.capacity})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClassroomList;