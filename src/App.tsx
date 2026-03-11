import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Login from "./pages/Login";
import History from "./pages/History";
import SelectFormType from "./pages/SelectFormType";
import NewRequest from "./pages/NewRequest";
import Forms from "./pages/Forms";
import ConsoleLayout from "./pages/ConsoleLayout";
import ClientsList from "./pages/ClientsList";
import CreateClient from "./pages/CreateClient";
import EditClient from "./pages/EditClient";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/history"
            element={
              <ProtectedRoute mode="user">
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/forms"
            element={
              <ProtectedRoute mode="user">
                <Forms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new"
            element={
              <ProtectedRoute mode="user">
                <SelectFormType />
              </ProtectedRoute>
            }
          />
          <Route
            path="/new/form"
            element={
              <ProtectedRoute mode="user">
                <NewRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/console"
            element={
              <ProtectedRoute mode="console">
                <ConsoleLayout />
              </ProtectedRoute>
            }
          >
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/:taskId/edit" element={<EditClient />} />
            <Route path="create-client" element={<CreateClient />} />
            <Route index element={<Navigate to="clients" replace />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
