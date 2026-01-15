import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Paper, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@mui/material'
import { api } from '../api/client'
import { useAuthStore } from '../store/authStore'
import Header from '../components/Header'

export default function Forms() {
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
          { label: 'Forms' }
        ]} />
        <Box>
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
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Workflow ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((form: any) => (
                <TableRow key={form.id}>
                  <TableCell>{form.id}</TableCell>
                  <TableCell>{form.name}</TableCell>
                  <TableCell>{form.description || '-'}</TableCell>
                  <TableCell>{form.workflowId}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => navigate(`/new/form?formId=${form.id}`)}>
                      Use
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  )
}
