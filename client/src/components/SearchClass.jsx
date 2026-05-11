import React, { useState } from 'react';
import { 
  Box, TextField, Button, Typography, Paper, MenuItem, 
  Grid, Card, CardContent, CircularProgress, FormControlLabel, Checkbox 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const SearchClass = () => {
  // Default date - Today
  const today = new Date().toISOString().split('T')[0];

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData);
    
    // Checkbox handling: if it's not checked, it won't be in the formData
    dataObj.hasProjector = !!dataObj.hasProjector;

    // Validation: Date is not in the past
    if (dataObj.date < today) {
      setError('לא ניתן לחפש חדרים עבור תאריכים שעברו.');
      return;
    }

    setLoading(true);
    const params = new URLSearchParams(dataObj);

    try {
      const response = await fetch(`http://localhost:3000/api/search?${params.toString()}`);
      if (!response.ok) throw new Error('לא נמצאו חדרים פנויים העונים לדרישות החיפוש.');
      
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
    <Box sx={{ p: 3, pb: 12, maxWidth: 900, margin: 'auto', direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'right' }}>
        חיפוש חדר פנוי
      </Typography>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 4, bgcolor: '#f8f9fa' }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={3} alignItems="center">
  {/* Row 1: Date and Times */}
  <Grid item xs={12} md={4}>
    <TextField 
      fullWidth label="תאריך" type="date" name="date" 
      defaultValue={today} InputLabelProps={{ shrink: true }} required 
    />
  </Grid>
  <Grid item xs={6} md={4}>
    <TextField 
      fullWidth label="שעת התחלה" type="time" name="startTime" 
      defaultValue="08:00" InputLabelProps={{ shrink: true }} required 
    />
  </Grid>
  <Grid item xs={6} md={4}>
    <TextField 
      fullWidth label="שעת סיום" type="time" name="endTime" 
      defaultValue="10:00" InputLabelProps={{ shrink: true }} required 
    />
  </Grid>

  {/* Row 2: Filters */}
  <Grid item xs={12} sm={6} md={4}>
    <TextField fullWidth label="קיבולת מינימלית" type="number" name="capacity" placeholder="למשל: 30" />
  </Grid>

  {/* FIXED: Larger grid size for 'Building' and 'Floor' */}
  <Grid item xs={12} sm={6} md={3}> 
    <TextField 
      fullWidth select label="אגף / בניין" name="building" defaultValue=""
      sx={{ minWidth: '150px' }} // Ensures the label is visible
    >
      <MenuItem value="">כל האגפים</MenuItem>
      <MenuItem value="אגף ימין">אגף ימין</MenuItem>
      <MenuItem value="אגף שמאל">אגף שמאל</MenuItem>
      <MenuItem value="אגף חדש">אגף חדש</MenuItem>
    </TextField>
  </Grid>

  <Grid item xs={6} sm={3} md={2}>
    <TextField fullWidth select label="קומה" name="floor" defaultValue="">
      <MenuItem value="">הכל</MenuItem>
      {[0, 1, 2, 3, 4].map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
    </TextField>
  </Grid>

  <Grid item xs={6} sm={3} md={2}>
    <FormControlLabel
      control={<Checkbox name="hasProjector" color="primary" />}
      label="מקרן"
      sx={{ mr: 2 }} // Adds some margin to the right
    />
  </Grid>

  <Grid item xs={12}>
    <Button 
      fullWidth variant="contained" type="submit" size="large" disabled={loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
      sx={{ 
          borderRadius: 2, height: 56, fontSize: '1.1rem',
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)'
      }}
    >
      {loading ? 'מחפש חדרים...' : 'חפשי חדר פנוי'}
    </Button>
  </Grid>
</Grid>
        </form>
      </Paper>

      {error && <Typography color="error" sx={{ mb: 3, textAlign: 'center' }}>{error}</Typography>}

      {/* Results */}
      <Grid container spacing={2}>
        {results.map((room) => (
          <Grid item xs={12} key={room._id}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MeetingRoomIcon sx={{ fontSize: 45, color: '#1976d2', ml: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{room.name} (חדר {room.number})</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {room.building} • קומה {room.floor} • {room.capacity} מקומות
                      {room.hasProjector && " • ✅ כולל מקרן"}
                    </Typography>
                  </Box>
                </Box>
                <Button 
                  variant="contained" color="success" startIcon={<AddCircleIcon />}
                  onClick={() => alert(`מבצע שיבוץ לחדר ${room.number}...`)}
                >
                  שבץ חדר
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {!loading && results.length === 0 && !error && (
        <Box textAlign="center" mt={4} color="text.secondary">
            <CalendarTodayIcon sx={{ fontSize: 50, mb: 1, opacity: 0.5 }} />
            <Typography>הזיני פרטים לחיפוש חדר פנוי</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SearchClass;