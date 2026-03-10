import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";

export default function Forms() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { data: mappingsData, isLoading: isMappingsLoading } = useQuery({
    queryKey: ["formMappings"],
    queryFn: async () => {
      const result = await api.getFormMappings();
      return result.data;
    },
  });

  const { data: formsData, isLoading: isFormsLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const result = await api.getForms();
      return result.data;
    },
  });

  const formsByKey = new Map<string, any>(
    (formsData || []).map((form: any) => [form.key, form]),
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Header
          breadcrumbs={[
            { label: "Home", path: "/history" },
            { label: "Forms" },
          ]}
        />
        <Box>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Paper>
        {isMappingsLoading || isFormsLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Form Key</TableCell>
                <TableCell>Form Name</TableCell>
                <TableCell>Workflow Key</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mappingsData?.map((mapping: any) => {
                const form = formsByKey.get(mapping.formKey) as any;
                return (
                  <TableRow key={mapping.id}>
                    <TableCell>{mapping.formKey}</TableCell>
                    <TableCell>{form?.name || mapping.formKey}</TableCell>
                    <TableCell>{mapping.workflowKey}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            `/new/form?formKey=${encodeURIComponent(mapping.formKey)}&workflowKey=${encodeURIComponent(mapping.workflowKey)}`,
                          )
                        }
                      >
                        Use
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
