import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { JsonForms } from "@jsonforms/react";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { createAjv } from "@jsonforms/core";
import ajvErrors from "ajv-errors";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";
import Header from "../components/Header";
import RatingControl from "../renderers/RatingControl";
import ratingControlTester from "../testers/ratingControlTester";
import AgeSliderControl from "../renderers/AgeSliderControl";
import ageSliderControlTester from "../testers/ageSliderControlTester";
import FileUploadControl from "../renderers/FileUploadControl";
import fileUploadControlTester from "../testers/fileUploadControlTester";

const ajv = createAjv({ allErrors: true });
ajvErrors(ajv);

export default function NewRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("formId");
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<any>({});
  const [formMapping, setFormMapping] = useState<any>(null);

  const renderers = useMemo(
    () => [
      ...materialRenderers,
      { tester: ratingControlTester, renderer: RatingControl },
      { tester: ageSliderControlTester, renderer: AgeSliderControl },
      { tester: fileUploadControlTester, renderer: FileUploadControl },
    ],
    []
  );

  const { data: formMappingData, isLoading } = useQuery({
    queryKey: ["formMapping", formId],
    queryFn: () => (formId ? api.getFormMappingById(parseInt(formId)) : null),
    enabled: !!formId,
  });

  useEffect(() => {
    if (formMappingData?.data) {
      setFormMapping(formMappingData.data);
    }
  }, [formMappingData]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (formMapping?.workflowId) {
        return api.submitForm(data, formMapping.formSchema);
      }
      throw new Error("No workflow ID found");
    },
    onSuccess: () => {
      alert("Request submitted successfully!");
      navigate("/history");
    },
    onError: (error: any) => {
      alert(`Failed to submit: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  if (!formId) {
    navigate("/new");
    return null;
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
            { label: "New Request", path: "/new" },
            { label: formMapping?.name || "Form" },
          ]}
        />
        <Button variant="outlined" onClick={() => navigate("/history")}>
          Back to History
        </Button>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 800 }}>
        {formMapping && (
          <>
            <Typography variant="h5" mb={3}>
              {formMapping.name}
            </Typography>
            <Box sx={{ "& .MuiFormControl-root": { mb: 3 } }}>
              <JsonForms
                schema={formMapping.formSchema}
                uischema={formMapping.uiSchema}
                data={formData}
                renderers={renderers}
                cells={materialCells}
                ajv={ajv}
                onChange={({ data }) => setFormData(data)}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={mutation.isPending}
              sx={{ mt: 3 }}
            >
              {mutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                "Submit Request"
              )}
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
