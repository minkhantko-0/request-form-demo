import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, Typography, Card, CardContent, CardActions, Grid, CircularProgress } from '@mui/material'
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
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Header breadcrumbs={[
          { label: 'Home', path: '/history' },
          { label: 'New Request' }
        ]} />
        <Box>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Typography variant="h6" mb={3}>Select Request Type</Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data?.map((form: any) => (
            <Grid item xs={12} sm={6} md={4} key={form.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {form.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {form.description || 'No description'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => navigate(`/new/form?formId=${form.id}`)}
                  >
                    Select
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
