import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
  mode?: "any" | "user" | "console";
};

export default function ProtectedRoute({
  children,
  mode = "any",
}: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (mode === "user" && user.roleId !== "user") {
    return <Navigate to="/console/clients" replace />;
  }

  if (mode === "console" && user.roleId === "user") {
    return <Navigate to="/history" replace />;
  }

  return <>{children}</>;
}
