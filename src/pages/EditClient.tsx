import { Box, Button, Paper, Typography } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import NewRequest from "./NewRequest";
import { api } from "../api/client";

export default function EditClient() {
  const navigate = useNavigate();
  const location = useLocation();
  const { taskId } = useParams();
  const task = (location.state as any)?.task;

  console.log("task ", task);
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
        formKey={"h2h_client_onboarding"}
        fixedFormId={0}
        homePath="/console/clients"
        successPath="/console/clients"
        newRequestPath={`/console/clients/${task.id}/edit`}
        initialData={task.workflowInstance?.variables || {}}
        submitButtonLabel="Dispatch Update"
        successMessage="Update event dispatched successfully!"
        customSubmit={({ data }) =>
          api.dispatchWorkflowEvent({
            instanceId: task.workflowInstance?.id,
            event: "update",
            payload: data,
          })
        }
      />
    </Box>
  );
}
