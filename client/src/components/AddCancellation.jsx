import React, { useState } from 'react';
import axios from 'axios';

const AddCancellation = ({ classroomId, classroomName, onClose }) => {
    // מצב התחלתי עם ערכי ברירת מחדל לפי הוראות "חיסכון בזמן"
    // המערכת תציע את שעות הפעילות המקובלות (למשל 08:00 עד 16:00)
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // תאריך של היום כברירת מחדל
        startTime: '08:00',
        endTime: '16:00',
        reason: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // הכתובת תואמת ל-Route שבנינו: /api/classrooms/:id/cancel
            await axios.patch(`http://localhost:5000/api/classrooms/${classroomId}/cancel`, formData);
            alert('הביטול התווסף בהצלחה למערכת החריגות');
            onClose(); // סגירת החלון הצף
        } catch (err) {
            alert('שגיאה: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>ביטול חד-פעמי (חריגה)</h2>
                <p style={styles.subtitle}>עבור חדר: <strong>{classroomName}</strong></p>
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>תאריך הביטול:</label>
                        <input type="date" name="date" value={formData.date} required onChange={handleChange} style={styles.input} />
                    </div>

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>משעה:</label>
                            <input type="time" name="startTime" value={formData.startTime} required onChange={handleChange} style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>עד שעה:</label>
                            <input type="time" name="endTime" value={formData.endTime} required onChange={handleChange} style={styles.input} />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>סיבת הביטול:</label>
                        <textarea name="reason" placeholder="למשל: יום התמחות / שיפוץ" onChange={handleChange} style={{...styles.input, height: '60px'}} />
                    </div>

                    <div style={styles.buttonGroup}>
                        <button type="submit" style={styles.saveBtn}>אישור ועדכון</button>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>סגור</button>
                    </div>
                </form>
                
                <p style={styles.note}>* השינוי יופיע במערכת החיפוש הדו-כיוונית (שעה/שיעור)</p>
            </div>
        </div>
    );
};

// עיצוב CSS-in-JS עבור החלון הצף
const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // רקע כהה שקוף מאחורי החלון
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)', // טשטוש של הרקע
    },
    modal: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)', // חלון לבן כמעט אטום
        padding: '30px',
        borderRadius: '15px',
        width: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        direction: 'rtl', // תמיכה בעברית
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    title: { margin: '0 0 10px 0', color: '#2c3e50', textAlign: 'center' },
    subtitle: { textAlign: 'center', marginBottom: '20px', color: '#7f8c8d' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    row: { display: 'flex', gap: '10px' },
    label: { fontSize: '14px', fontWeight: 'bold', color: '#34495e' },
    input: {
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px'
    },
    buttonGroup: { display: 'flex', gap: '10px', marginTop: '10px' },
    saveBtn: {
        flex: 2, padding: '12px', backgroundColor: '#3498db', color: 'white',
        border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
    },
    cancelBtn: {
        flex: 1, padding: '12px', backgroundColor: '#ecf0f1', color: '#7f8c8d',
        border: 'none', borderRadius: '5px', cursor: 'pointer'
    },
    note: { fontSize: '11px', color: '#95a5a6', marginTop: '15px', textAlign: 'center' }
};

export default AddCancellation;