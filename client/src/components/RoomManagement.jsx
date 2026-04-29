import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const RoomManagement = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // הכתובת שטובי נתנה
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

    // 1. מימוש מחיקת חדר
    const handleDelete = async (id) => {
        if (window.confirm("האם את בטוחה שברצונך למחוק את החדר לצמיתות?")) {
            try {
                // שליחת בקשת Delete לשרת לפי ה-ID של החדר
                await axios.delete(`http://localhost:3000/api/classrooms/${id}`);
                // עדכון ה-State המקומי כדי שהחדר ייעלם מהטבלה מיד
                setClassrooms(classrooms.filter(room => room._id !== id));
                alert("החדר נמחק בהצלחה");
            } catch (error) {
                console.error("שגיאה במחיקת החדר:", error);
                alert("המחיקה נכשלה, בדקי שהשרת פועל");
            }
        }
    };

    // 2. לוגיקת ניקוי כל השיבוצים (Allocations)
    const handleClearAll = async () => {
        if (window.confirm("האם את בטוחה שברצונך לנקות את כל השיבוצים במערכת?")) {
            try {
                // קריאת API לשרת לניקוי השיבוצים (ודאי מול טובי שזה הנתיב)
                await axios.post('http://localhost:3000/api/classrooms/clear-all-allocations');
                alert("כל השיבוצים נוקו בהצלחה");
                fetchData(); // רענון הנתונים כדי לראות את השינוי בטבלה
            } catch (error) {
                console.error("שגיאה בניקוי השיבוצים:", error);
                alert("פעולת הניקוי נכשלה");
            }
        }
    };

    // לוגיקת המיון הנדרשת במשימה שלך
    const sortedRooms = useMemo(() => {
        let sortableRooms = [...classrooms];
        if (sortConfig.key) {
            sortableRooms.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableRooms;
    }, [classrooms, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };


    if (loading) return <p>טוען כיתות... ⏳</p>;

    return (
        <div style={{ padding: '20px', direction: 'rtl' }}>
            <h1>ניהול חדרים</h1>
            
            {/* כפתור ניקוי כללי לפי המשימה שלך */}
            <button onClick={handleClearAll} style={{ backgroundColor: 'red', color: 'white', marginBottom: '10px' }}>
                ניקוי כל השיבוצים במערכת
            </button>

            <table border="1" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#e6ffed' }}>
                        <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>שם חדר ↕</th>
                        <th onClick={() => requestSort('building')} style={{ cursor: 'pointer' }}>אגף/בניין ↕</th>
                        <th onClick={() => requestSort('floor')} style={{ cursor: 'pointer' }}>קומה ↕</th>
                        <th>קיבולת</th>
                        <th>מקרן</th>
                        <th>פעולות</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedRooms.map((room) => (
                        <tr key={room._id}>
                            <td>{room.name}</td>
                            <td>{room.building}</td>
                            <td>{room.floor}</td>
                            <td>{room.capacity}</td>
                            <td>{room.hasProjector ? '✅' : '❌'}</td>
                            <td>
                                {/* כפתורים הנדרשים במשימה */}
                                <button>👁️ צפייה</button>
                                <button>✏️ עריכה</button><button 
                                    onClick={() => handleDelete(room._id)} 
                                    style={{ color: 'red', cursor: 'pointer' }}
                                >
                                    🗑️ מחיקה
                                </button>
                                {/* <button style={{ color: 'red' }}>🗑️ מחיקה</button> */}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoomManagement;