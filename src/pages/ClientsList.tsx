import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Button,
  Collapse,
  CircularProgress,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function ClientsList() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [expandedTaskIds, setExpandedTaskIds] = useState<
    Record<string, boolean>
  >({});
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", user?.email, user?.roleId],
    queryFn: () =>
      api.getTasks({
        userId: user?.email || "unknown",
        roleId: user?.roleId || "unknown",
        status: "pending",
      }),
    enabled: !!user,
  });

  const completeTaskMutation = useMutation({
    mutationFn: (params: {
      taskId: string;
      instanceId: string;
      isApproved: boolean;
      remark: string;
    }) => api.completeTask(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const dispatchIncompleteMutation = useMutation({
    mutationFn: (params: { instanceId: string }) =>
      api.dispatchWorkflowEvent({
        instanceId: params.instanceId,
        event: "incomplete",
        payload: {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setToast({
        open: true,
        message: "Incomplete event dispatched successfully",
        severity: "success",
      });
    },
    onError: (error: unknown) => {
      setToast({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Failed to dispatch incomplete event",
        severity: "error",
      });
    },
  });

  const tasks = Array.isArray(data) ? data : data?.data || [];

  const toggleExpand = (taskId: string) => {
    setExpandedTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  return (
    <>
      <Paper>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
              Client Tasks
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Instance ID</TableCell>
                  <TableCell>Ref ID</TableCell>
                  <TableCell>Stage</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task: any) => {
                  const isExpanded = !!expandedTaskIds[task.id];
                  return (
                    <Fragment key={task.id}>
                      <TableRow>
                        <TableCell>{task.instanceId}</TableCell>
                        <TableCell>
                          {task.workflowInstance?.refId || "-"}
                        </TableCell>
                        <TableCell>{task.nodeKey || "-"}</TableCell>
                        <TableCell>
                          {task.createdAt
                            ? new Date(task.createdAt).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            onClick={() => toggleExpand(task.id)}
                          >
                            {isExpanded ? "Hide Details" : "Show Details"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell
                          colSpan={5}
                          sx={{
                            py: 0,
                            borderBottom: isExpanded ? undefined : 0,
                          }}
                        >
                          <Collapse
                            in={isExpanded}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ p: 2, bgcolor: "#fafafa" }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Workflow Instance Variables
                              </Typography>
                              <pre
                                style={{ margin: 0, whiteSpace: "pre-wrap" }}
                              >
                                {JSON.stringify(
                                  task.workflowInstance?.variables || {},
                                  null,
                                  2,
                                )}
                              </pre>

                              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  size="small"
                                  disabled={
                                    completeTaskMutation.isPending ||
                                    dispatchIncompleteMutation.isPending
                                  }
                                  onClick={() =>
                                    completeTaskMutation.mutate({
                                      taskId: task.id,
                                      instanceId: task.instanceId,
                                      isApproved: true,
                                      remark: "Approved from console",
                                    })
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="error"
                                  size="small"
                                  disabled={
                                    completeTaskMutation.isPending ||
                                    dispatchIncompleteMutation.isPending
                                  }
                                  onClick={() =>
                                    completeTaskMutation.mutate({
                                      taskId: task.id,
                                      instanceId: task.instanceId,
                                      isApproved: false,
                                      remark: "Rejected from console",
                                    })
                                  }
                                >
                                  Reject
                                </Button>
                                {user?.roleId === "checker" && (
                                  <Button
                                    variant="outlined"
                                    color="warning"
                                    size="small"
                                    disabled={
                                      completeTaskMutation.isPending ||
                                      dispatchIncompleteMutation.isPending
                                    }
                                    onClick={() =>
                                      dispatchIncompleteMutation.mutate({
                                        instanceId: task.instanceId,
                                      })
                                    }
                                  >
                                    Incomplete
                                  </Button>
                                )}
                                {user?.roleId !== "checker" && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() =>
                                      navigate(
                                        `/console/clients/${task.id}/edit`,
                                        {
                                          state: { task },
                                        },
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                )}
                              </Box>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </>
        )}
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
