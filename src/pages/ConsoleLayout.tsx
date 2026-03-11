import { Box, Button } from "@mui/material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { useAuthStore } from "../store/authStore";

export default function ConsoleLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

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
          mb: 3,
        }}
      >
        <Header
          breadcrumbs={[
            { label: "Console", path: "/console/clients" },
            {
              label:
                location.pathname === "/console/create-client"
                  ? "Create Client"
                  : "Clients",
            },
          ]}
        />
        <Box>
          <Button
            variant="contained"
            onClick={() => navigate("/console/clients")}
            sx={{ mr: 2 }}
          >
            Clients
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/console/create-client")}
            sx={{ mr: 2 }}
          >
            Create Client
          </Button>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      <Outlet />
    </Box>
  );
}
