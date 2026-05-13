import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, MenuItem, 
  Grid, Card, CardContent, CircularProgress, FormControlLabel, Checkbox,
  ToggleButton, ToggleButtonGroup, Divider, Switch
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UpdateIcon from '@mui/icons-material/Update';

const SearchClass = () => {
  const currentYear = new Date().getFullYear();
  const today = new Date().toISOString().split('T')[0];

  const [allocType, setAllocType] = useState('temporary'); 
  const [useLessons, setUseLessons] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(formData);
    
    dataObj.isTemporary = allocType === 'temporary';
    dataObj.hasProjector = dataObj.hasProjector === 'on';

    const params = new URLSearchParams(dataObj);

    try {
      const response = await fetch(`http://localhost:3000/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('לא נמצאו חדרים פנויים העונים לדרישות.');
      const data = await response.json();
      setResults(data.results || []);
    } catch (err) {
      setResults([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, pb: 12, maxWidth: 1100, margin: 'auto', direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center', mb: 4 }}>
        איתור חדר פנוי
      </Typography>

      <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        {/* כפתורי בחירת סוג שיבוץ */}
        <Box sx={{ bgcolor: '#f8f9fa', p: 2, display: 'flex', justifyContent: 'center', borderBottom: '1px solid #ddd' }}>
          <ToggleButtonGroup
            value={allocType}
            exclusive
            onChange={(e, val) => val && setAllocType(val)}
            color="primary"
            sx={{ direction: 'ltr', bgcolor: 'white' }}
          >
            <ToggleButton value="temporary" sx={{ px: { xs: 2, md: 5 }, fontWeight: 'bold' }}>
               שיבוץ זמני <CalendarMonthIcon sx={{ mr: 1 }} />
            </ToggleButton>
            <ToggleButton value="permanent" sx={{ px: { xs: 2, md: 5 }, fontWeight: 'bold' }}>
               שיבוץ קבוע <UpdateIcon sx={{ mr: 1 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <form onSubmit={handleSearch}>
          <Box sx={{ p: 4 }}>
            {/* חלק 1: זמן */}
            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold', borderBottom: '2px solid #1976d2', width: 'fit-content', pb: 0.5 }}>
              1. מתי השיבוץ?
            </Typography>
            
            <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
              {allocType === 'permanent' ? (
                <>
                  <Grid item xs={12} md={4}>
                    <TextField fullWidth select label="יום בשבוע" name="day" defaultValue="Sunday">
                      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(d => (
                        <MenuItem key={d} value={d}>{d}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField fullWidth label="מתאריך" type="date" name="startDate" defaultValue={`${currentYear}-09-01`} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <TextField fullWidth label="עד תאריך" type="date" name="endDate" defaultValue={`${currentYear + 1}-06-30`} InputLabelProps={{ shrink: true }} />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="תאריך השיבוץ" type="date" name="date" defaultValue={today} InputLabelProps={{ shrink: true }} required />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel 
                      control={<Switch checked={useLessons} onChange={(e) => setUseLessons(e.target.checked)} />} 
                      label="שיבוץ לפי מספר שיעור" 
                      sx={{ mr: 2 }}
                    />
                  </Grid>
                </>
              )}

              {/* שעות או שיעורים */}
              {useLessons && allocType === 'temporary' ? (
                <Grid item xs={12}>
                  <TextField fullWidth select label="בחר מספר שיעור" name="lessonNumber" defaultValue="">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(l => (
                      <MenuItem key={l} value={l}>שיעור {l}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : (
                <>
                  <Grid item xs={6} md={3}>
                    <TextField fullWidth label="שעת התחלה" type="time" name="startTime" defaultValue="08:00" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField fullWidth label="שעת סיום" type="time" name="endTime" defaultValue="10:00" InputLabelProps={{ shrink: true }} />
                  </Grid>
                </>
              )}
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* חלק 2: מאפייני חדר */}
            {/* חלק 2: דרישות מהחדר */}
<Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold', borderBottom: '2px solid #1976d2', width: 'fit-content', pb: 0.5 }}>
  2. דרישות מהחדר
</Typography>

<Grid container spacing={3} alignItems="center">
  {/* קיבולת מינימלית - נותנים לו 4 יחידות כדי שיהיה רחב וקריא */}
  <Grid item xs={12} md={4}>
    <TextField 
      fullWidth 
      label="קיבולת מינימלית" 
      type="number" 
      name="capacity" 
      InputLabelProps={{ shrink: true }} 
    />
  </Grid>
  
  {/* אגף / בניין - הגדלתי ל-4 יחידות כדי שהכותרת והערך לא ייחתכו */}
  <Grid item xs={12} md={4}>
    <TextField 
      fullWidth 
      select 
      label="אגף" 
      name="building" 
      defaultValue=""
      InputLabelProps={{ shrink: true }}
    >
      <MenuItem value="">כל האגפים</MenuItem>
      <MenuItem value="אגף ימין">אגף ימין</MenuItem>
      <MenuItem value="אגף שמאל">אגף שמאל</MenuItem>
    </TextField>
  </Grid>

  {/* קומה - 2 יחידות זה מספיק למספר קטן, אבל נדאג שהתווית למעלה */}
  <Grid item xs={12} md={2}>
    <TextField 
      fullWidth 
      select 
      label="קומה" 
      name="floor" 
      defaultValue=""
      InputLabelProps={{ shrink: true }}
    >
      <MenuItem value="">הכל</MenuItem>
      {[0, 1, 2, 3, 4, 5].map(f => (
        <MenuItem key={f} value={f}>{f}</MenuItem>
      ))}
    </TextField>
  </Grid>

  {/* מקרן - תופס את יתרת המקום (2 יחידות) */}
  <Grid item xs={12} md={2}>
    <Box sx={{ 
      border: '1px solid #ced4da', 
      borderRadius: 1, 
      height: '56px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <FormControlLabel
        control={<Checkbox name="hasProjector" />}
        label="מקרן"
        sx={{ m: 0 }}
      />
    </Box>
  </Grid>
</Grid>
          </Box>

          {/* כפתור חיפוש */}
          <Box sx={{ p: 3, bgcolor: '#f1f3f4', textAlign: 'center' }}>
            <Button 
              variant="contained" 
              type="submit" 
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ 
                px: 8, py: 1.5, borderRadius: 2, fontSize: '1.2rem', fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {loading ? 'מחפש חדרים...' : 'חפשי חדר פנוי'}
            </Button>
          </Box>
        </form>
      </Paper>

      {/* הודעת שגיאה */}
      {error && (
        <Typography color="error" sx={{ textAlign: 'center', mb: 3, fontWeight: 'bold', p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
          {error}
        </Typography>
      )}

      {/* תוצאות */}
      <Grid container spacing={3}>
        {results.map((room) => (
          <Grid item xs={12} key={room._id}>
            <Card sx={{ borderRadius: 3, border: '1px solid #e0e0e0', transition: '0.2s', '&:hover': { boxShadow: 4 } }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ bgcolor: '#e3f2fd', p: 1.5, borderRadius: '50%', ml: 2 }}>
                    <MeetingRoomIcon sx={{ fontSize: 30, color: '#1976d2' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{room.name} (חדר {room.number})</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {room.building} • קומה {room.floor} • קיבולת: {room.capacity}
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" color="success" startIcon={<AddCircleIcon />} sx={{ borderRadius: 2, px: 3 }}>
                  שבץ חדר
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SearchClass;