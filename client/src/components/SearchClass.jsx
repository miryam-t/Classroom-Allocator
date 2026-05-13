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
  const today = new Date().toISOString().split('T');

  const [allocType, setAllocType] = useState('temporary'); 
  const [useLessons, setUseLessons] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <Box sx={{ p: 3, pb: 12, maxWidth: 1000, margin: 'auto', direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center', mb: 4 }}>
        איתור חדר פנוי
      </Typography>

      <Paper elevation={6} sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
        {/* Toggle Header */}
        <Box sx={{ bgcolor: '#f1f3f4', p: 2, display: 'flex', justifyContent: 'center', borderBottom: '1px solid #ddd' }}>
          <ToggleButtonGroup
            value={allocType}
            exclusive
            onChange={(e, val) => val && setAllocType(val)}
            color="primary"
            sx={{ direction: 'ltr', bgcolor: 'white' }}
          >
            <ToggleButton value="temporary" sx={{ px: { xs: 2, md: 5 } }}>
               שיבוץ זמני <CalendarMonthIcon sx={{ mr: 1 }} />
            </ToggleButton>
            <ToggleButton value="permanent" sx={{ px: { xs: 2, md: 5 } }}>
               שיבוץ קבוע <UpdateIcon sx={{ mr: 1 }} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <form>
          <Box sx={{ p: 4 }}>
            {/* SECTION 1: Time Context */}
            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
              1. מועד השיבוץ
            </Typography>
            
            <Grid container spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
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
                  <Grid item xs={12} md={5}>
                    <TextField fullWidth label="תאריך השיבוץ" type="date" name="date" defaultValue={today} InputLabelProps={{ shrink: true }} required />
                  </Grid>
                  <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'center', height: '56px' }}>
                    <FormControlLabel 
                      control={<Switch checked={useLessons} onChange={(e) => setUseLessons(e.target.checked)} />} 
                      label="לפי שיעור" 
                    />
                  </Grid>
                </>
              )}

              {/* Time vs Lesson Logic */}
              {useLessons && allocType === 'temporary' ? (
                <Grid item xs={12} md={4}>
                  <TextField fullWidth select label="בחר שיעור" name="lessonNumber" defaultValue="">
                    {[1, 2, 3, 4, 5].map(l => (
                      <MenuItem key={l} value={l}>שיעור {l}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
              ) : (
                <>
                  <Grid item xs={6} md={2}>
                    <TextField fullWidth label="שעת התחלה" type="time" name="startTime" defaultValue="08:00" InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={6} md={2}>
                    <TextField fullWidth label="שעת סיום" type="time" name="endTime" defaultValue="10:00" InputLabelProps={{ shrink: true }} />
                  </Grid>
                </>
              )}
            </Grid>

            <Divider sx={{ mb: 4 }} />

            {/* SECTION 2: Room Requirements */}
            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 'bold' }}>
              2. מאפייני חדר נדרשים
            </Typography>
            
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField fullWidth label="קיבולת מינימלית" type="number" name="capacity" />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField fullWidth select label="אגף" name="building" defaultValue="">
                  <MenuItem value="">הכל</MenuItem>
                  <MenuItem value="אגף ימין">אגף ימין</MenuItem>
                  <MenuItem value="אגף שמאל">אגף שמאל</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField fullWidth select label="קומה" name="floor" defaultValue="">
                  <MenuItem value="">הכל</MenuItem>
                  {[1, 2, 3, 4, 5].map(f => (
                    <MenuItem key={f} value={f}>{f}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} md={3}>
                <FormControlLabel
                  control={<Checkbox name="hasProjector" />}
                  label="צריך מקרן?"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Action Button */}
          <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #ddd', textAlign: 'center' }}>
            <Button 
              variant="contained" 
              type="submit" 
              size="large"
              startIcon={<SearchIcon />}
              sx={{ 
                px: 10, py: 1.5, borderRadius: 3, fontSize: '1.2rem', fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)'
              }}
            >
              חפשי חדר פנוי
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default SearchClass;