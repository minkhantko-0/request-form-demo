import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NewRequest from "./NewRequest";

export default function EditClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams();
  const task = (location.state as any)?.task;

  if (!task) {
    return (
      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Edit Task
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Task data is missing. Please open edit from the clients list.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/console/clients")}
        >
          Back to Clients
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Client ({taskId})
      </Typography>
      <NewRequest
        fixedFormId={6}
        homePath="/console/clients"
        successPath="/console/clients"
        newRequestPath={`/console/clients/${task.id}/edit`}
        initialData={task.workflowInstance?.variables || {}}
      />
    </Box>
  );
}
