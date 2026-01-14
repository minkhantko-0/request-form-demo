import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material'
import { api } from '../api/client'
import { useAuthStore } from '../store/authStore'
import Header from '../components/Header'

export default function History() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)
  
  const { data, isLoading } = useQuery({
    queryKey: ['workflowInstances', user?.email],
    queryFn: () => api.getWorkflowInstances(user?.email),
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
          { label: 'History' }
        ]} />
        <Box>
          <Button variant="contained" onClick={() => navigate('/forms')} sx={{ mr: 2 }}>
            Forms
          </Button>
          <Button variant="contained" onClick={() => navigate('/new')} sx={{ mr: 2 }}>
            New Request
          </Button>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Paper>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Workflow</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((instance: any) => (
                <TableRow key={instance.id}>
                  <TableCell>{instance.refId || instance.id}</TableCell>
                  <TableCell>{instance.workflowId}</TableCell>
                  <TableCell>{instance.status}</TableCell>
                  <TableCell>{new Date(instance.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  )
}
