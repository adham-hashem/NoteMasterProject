import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import EditNoteIcon from '@mui/icons-material/EditNote';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

function HomePage() {
  return (
    <Box>
      {/* Main content */}
      <Typography variant="h2" gutterBottom>
        <span style={{ color: '#1976D2' }}>Welcome</span> to our website
      </Typography>
      <Typography variant="h5" gutterBottom>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <EditNoteIcon sx={{ marginRight: '8px' }} />
          Enjoy with our platform for organizing and managing your subject notes.
        </Box>
      </Typography>
      <Typography variant="h5" gutterBottom sx={{ mt: '20px' }}>Our services:</Typography>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                padding: '20px',
                transition: 'transform 0.3s',
                "&:hover": {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <NoteAltIcon />
              </Box>
              <CardContent>
                <Typography variant="h5" sx={{ textAlign: 'center' }}>Organize Notes</Typography>
                <Typography variant="body1">
                  Keep all your subject notes in one place, organized by subject and category for easy access.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                padding: '20px',
                transition: 'transform 0.3s',
                "&:hover": {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <TrackChangesIcon />
              </Box>
              <CardContent>
                <Typography variant="h5" sx={{ textAlign: 'center' }}>Track Your Progress</Typography>
                <Typography variant="body1">
                  Monitor your study progress and review past notes to keep up with your learning goals.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                padding: '20px',
                transition: 'transform 0.3s',
                "&:hover": {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <AccessTimeIcon />
              </Box>
              <CardContent>
                <Typography variant="h5" sx={{ textAlign: 'center' }}>Access Anywhere</Typography>
                <Typography variant="body1">
                  View and edit your notes on any device, whether you're on the go or studying from home.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ mt: 4, py: 2, backgroundColor: '#f5f5f5', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Note Master. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}

export default HomePage;
