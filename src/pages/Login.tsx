import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useAuthStore } from "../store/authStore";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("user");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { data: roleRes } = useQuery({
    queryKey: ["roles"],
    queryFn: api.getRoles,
  });

  const roles = roleRes?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedRole = roles.find((role: any) => role.id === roleId) || {
      id: roleId,
      name: roleId,
    };

    await login(email, password, {
      id: selectedRole.id,
      name: selectedRole.name,
    });

    if (selectedRole.id === "user") {
      navigate("/history");
      return;
    }

    navigate("/console/clients");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: 40 }}>📋</Typography>
          <Typography variant="h4">Request Portal</Typography>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              value={roleId}
              label="Role"
              onChange={(e) => setRoleId(e.target.value)}
            >
              {roles.map((role: any) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
