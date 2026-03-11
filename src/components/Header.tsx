import { Box, Typography, Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export default function Header({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbItem[];
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
      <Typography sx={{ fontSize: 40 }}>📋</Typography>
      <Box>
        <Typography variant="caption" color="text.secondary">
          Request Portal
        </Typography>
        {user && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            {user.email} ({user.roleName})
          </Typography>
        )}
        <Breadcrumbs>
          {breadcrumbs.map((item, index) =>
            item.path ? (
              <Link
                key={index}
                component={RouterLink}
                to={item.path}
                underline="hover"
                color="inherit"
              >
                {item.label}
              </Link>
            ) : (
              <Typography key={index} color="text.primary">
                {item.label}
              </Typography>
            ),
          )}
        </Breadcrumbs>
      </Box>
    </Box>
  );
}
