import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Card, CardContent, CardActions, Grid, CircularProgress, Chip } from '@mui/material'
import { api } from '../api/client'
import { useAuthStore } from '../store/authStore'
import Header from '../components/Header'

export default function SelectFormType() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  
  const { data, isLoading } = useQuery({
    queryKey: ['formMappings'],
    queryFn: async () => {
      const result = await api.getFormMappings()
      return result.data
    },
  })

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ p: 4, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Header breadcrumbs={[
          { label: 'Home', path: '/history' },
          { label: 'New Request' }
        ]} />
        <Box>
          <Button variant="outlined" onClick={() => navigate('/history')} sx={{ mr: 2 }}>
            Back
          </Button>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Typography variant="h5" mb={1} fontWeight={600}>
          Select Request Type
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Choose a form template to create your request
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {data?.map((form: any) => (
              <Grid item xs={12} sm={6} md={4} key={form.id}>
                <Card 
                  sx={{ 
                    height: 240,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography sx={{ fontSize: 28 }}>📋</Typography>
                      <Chip 
                        label={form.workflowId} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      fontWeight={600}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {form.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {form.description || 'No description available'}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      fullWidth
                      variant="contained"
                      onClick={() => navigate(`/new/form?formId=${form.id}`)}
                    >
                      Select Form
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  )
}
