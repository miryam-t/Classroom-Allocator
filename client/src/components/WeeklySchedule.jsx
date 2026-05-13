import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeeklySchedule.css';

import {
    Dialog, DialogContent, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, TextField,
    Typography, Box, IconButton, Avatar, Slide, Divider, Tooltip
} from '@mui/material';

import {
    Close as CloseIcon,
    DeleteSweep as DeleteSweepIcon,
    AddCircle as AddCircleIcon,
    EventBusy as EventBusyIcon,
    Edit as EditIcon
} from '@mui/icons-material';

// 1. הגדרת האנימציה
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const WeeklySchedule = ({ open, onClose, roomId, roomName }) => {
    const [allAllocations, setAllAllocations] = useState([]);
    const [isDailyOpen, setIsDailyOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי"];
    const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

    // 2. שליפת הנתונים מהמסד
    useEffect(() => {
        const fetchSchedule = async () => {
            if (open && roomId) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/classroom/${roomId}`);

                    // שליפת המערך מתוך אובייקט החדר
                    setAllAllocations(response.data.allocations || []);

                    console.log("הנתונים הגיעו בהצלחה:", response.data.allocations);
                } catch (error) {
                    console.error("שגיאה בטעינת הנתונים:", error);
                }
            }
        };
        fetchSchedule();
    }, [open, roomId]);

    // 3. פונקציית עזר להצגת שיבוץ קבוע בטבלה השבועית
    const getPermanentCellData = (dayIndex, hour) => {
        const found = allAllocations.find(a =>
            a.dayOfWeek === dayIndex &&
            a.startTime === hour &&
            a.isPermanent === true
        );
        return found ? (
            <Box sx={{ bgcolor: '#e0f2fe', p: 0.5, borderRadius: '4px', borderRight: '3px solid #0284c7' }}>
                <Typography variant="caption" fontWeight="700" color="#0369a1">
                    {found.courseName}
                </Typography>
            </Box>
        ) : '';
    };

    // 4. לוגיקה להצגת המערכת היומית (קבועה + זמנית) בחלון הצף השני
    const renderDailySchedule = () => {
        if (!selectedDate) return null;
        const dateObj = new Date(selectedDate);
        const dayOfWeek = dateObj.getDay();

        const dailySpecs = allAllocations.filter(a =>
            (a.isPermanent && a.dayOfWeek === dayOfWeek) ||
            (!a.isPermanent && a.date === selectedDate)
        );

        if (dailySpecs.length === 0) {
            return <Typography align="center" sx={{ my: 3, color: 'text.secondary' }}>אין שיבוצים ליום זה</Typography>;
        }

        return (
            <Box sx={{ mt: 2 }}>
                {dailySpecs.sort((a, b) => a.startTime.localeCompare(b.startTime)).map((alloc, index) => (
                    <Box key={index} sx={{
                        display: 'flex', justifyContent: 'space-between', p: 1.5, mb: 1,
                        bgcolor: alloc.isPermanent ? '#f1f5f9' : '#fef3c7',
                        borderRadius: '8px', borderRight: `5px solid ${alloc.isPermanent ? '#64748b' : '#f59e0b'}`
                    }}>
                        <Typography variant="body2" fontWeight="bold">{alloc.startTime}</Typography>
                        <Typography variant="body2">{alloc.courseName}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {alloc.isPermanent ? 'קבוע' : 'זמני'}
                        </Typography>
                    </Box>
                ))}
            </Box>
        );
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setIsDailyOpen(true);
    };

    return (
        <>
            {/* חלון 1: המערכת השבועית הראשית */}
            <Dialog
                open={open}
                onClose={onClose}
                TransitionComponent={Transition}
                transitionDuration={500}
                keepMounted
                maxWidth="lg"
                fullWidth
                PaperProps={{ sx: { borderRadius: '24px', overflow: 'hidden' } }}
            >
                {/* כותרת */}
                <Box sx={{
                    position: 'relative', height: '120px',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    color: 'white', display: 'flex', alignItems: 'center', px: 4
                }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 60, height: 60, mr: 2 }}>🏫</Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight="700">חדר {roomName}</Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>ניהול מערכת שעות מלא</Typography>
                    </Box>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 15, right: 15, color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <DialogContent sx={{ p: 4 }}>
                    {/* סרגל כפתורים */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                type="date"
                                label="בחר תאריך למערכת יומית"
                                value={selectedDate}
                                onChange={handleDateChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                                sx={{ width: 220 }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="ביטול שיעור בודד בתאריך מסוים">
                                <Button variant="outlined" color="warning" startIcon={<EventBusyIcon />}>ביטול חד פעמי</Button>
                            </Tooltip>
                            <Button variant="outlined" color="primary" startIcon={<EditIcon />}>עדכון קבוע</Button>
                            <Button variant="outlined" color="error" startIcon={<DeleteSweepIcon />}>מחיקת הכל</Button>
                        </Box>
                    </Box>

                    {/* טבלה שבועית קבועה */}
                    <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '15px' }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>שעה</TableCell>
                                    {days.map((day, idx) => (
                                        <TableCell key={day} align="center" sx={{ bgcolor: '#f8fafc', fontWeight: 'bold' }}>יום {day}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {hours.map((hour) => (
                                    <TableRow key={hour}>
                                        <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: '#fcfcfc' }}>{hour}</TableCell>
                                        {days.map((_, dayIndex) => (
                                            <TableCell key={dayIndex} align="center" sx={{ height: '55px', borderRight: '1px solid #f1f5f9' }}>
                                                {getPermanentCellData(dayIndex, hour)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
            </Dialog>

            {/* חלון 2: המערכת היומית לתאריך נבחר (צף מעל) */}
            <Dialog
                open={isDailyOpen}
                onClose={() => setIsDailyOpen(false)}
                TransitionComponent={Transition}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '20px', p: 1, border: '2px solid #3b82f6' } }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="700" color="primary">
                        יום {selectedDate ? days[new Date(selectedDate).getDay()] : ''} ({selectedDate})
                    </Typography>
                    <IconButton onClick={() => setIsDailyOpen(false)}><CloseIcon /></IconButton>
                </Box>
                <Divider />
                <DialogContent>
                    {renderDailySchedule()}

                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        sx={{ mt: 3, borderRadius: '12px', py: 1.5 }}
                    >
                        הוספת שיבוץ זמני
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default WeeklySchedule;