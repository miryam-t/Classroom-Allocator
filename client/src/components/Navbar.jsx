
// export default Navbar;
import React, { useState } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';

const Navbar = () => {
  const location = useLocation();
  // הגדרת הערך הנבחר לפי הנתיב הנוכחי בדפדפן
  const [value, setValue] = useState(location.pathname);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Paper נותן את הרקע והצל בתחתית המסך */}
      <Paper 
        elevation={10} 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          borderRadius: '20px 20px 0 0', // פינות מעוגלות למעלה
          overflow: 'hidden'
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          sx={{
            height: 80, // גובה גדול יותר למראה אפליקטיבי
            backgroundColor: '#ffffff',
            '& .Mui-selected': {
              '& .MuiBottomNavigationAction-label': {
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              },
              '& .MuiSvgIcon-root': {
                transform: 'scale(1.3)', // הגדלת האייקון כשנבחר
                color: '#ff4081' // צבע ורוד עז לאייקון הנבחר
              }
            }
          }}
        >
          {/* כפתור בית - כחול */}
          <BottomNavigationAction
            label="בית"
            value="/"
            component={Link}
            to="/"
            icon={<HomeRoundedIcon sx={{ fontSize: 30, color: '#2196f3' }} />}
          />

          {/* כפתור כיתות - ירוק */}
          <BottomNavigationAction
            label="כיתות"
            value="/classrooms"
            component={Link}
            to="/classrooms"
            icon={<ClassRoundedIcon sx={{ fontSize: 30, color: '#4caf50' }} />}
          />

          {/* כפתור שיבוץ חדש - כתום/גרדיאנט בולט */}
          <BottomNavigationAction
            label="שיבוץ"
            value="/allocate"
            component={Link}
            to="/allocate"
            icon={
              <Box sx={{
                background: 'linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)',
                borderRadius: '50%',
                padding: '10px',
                display: 'flex',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)'
              }}>
                <AddCircleOutlineRoundedIcon sx={{ fontSize: 35, color: 'white' }} />
              </Box>
            }
          />

          {/* כפתור דוחות/סטטיסטיקה - סגול */}
          <BottomNavigationAction
            label="דוחות"
            value="/reports"
            component={Link}
            to="/reports"
            icon={<AssessmentRoundedIcon sx={{ fontSize: 30, color: '#9c27b0' }} />}
          />
        </BottomNavigation>
      </Paper>
      
      {/* הוספת רווח בתחתית כדי שהתוכן של הדף לא יוסתר על ידי הסרגל */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
};

export default Navbar;