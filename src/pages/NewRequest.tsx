import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
import RatingControl from "../renderers/RatingControl";
import ratingControlTester from "../testers/ratingControlTester";
import AgeSliderControl from "../renderers/AgeSliderControl";
import ageSliderControlTester from "../testers/ageSliderControlTester";
import FileUploadControl from "../renderers/FileUploadControl";
import fileUploadControlTester from "../testers/fileUploadControlTester";

const ajv = createAjv({ allErrors: true });
ajvErrors(ajv);

const viteEnv = (import.meta as any).env || {};

const Envs = {
  API_URL: viteEnv.VITE_API_URL || "http://localhost:3001",
};

type NewRequestProps = {
  fixedFormId?: number;
  homePath?: string;
  successPath?: string;
  newRequestPath?: string;
  initialData?: Record<string, any>;
};

export default function NewRequest({
  fixedFormId,
  homePath = "/history",
  successPath = "/history",
  newRequestPath = "/new",
  initialData,
}: NewRequestProps) {
  void homePath;
  void newRequestPath;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formId = fixedFormId ? String(fixedFormId) : searchParams.get("formId");
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<any>({});
  const [formMapping, setFormMapping] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const initialDataAppliedRef = useRef(false);

  const renderers = useMemo(
    () => [
      ...materialRenderers,
      { tester: ratingControlTester, renderer: RatingControl },
      { tester: ageSliderControlTester, renderer: AgeSliderControl },
      { tester: fileUploadControlTester, renderer: FileUploadControl },
    ],
    [],
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

  useEffect(() => {
    if (!initialData || initialDataAppliedRef.current) return;
    setFormData(initialData);
    initialDataAppliedRef.current = true;
  }, [initialData]);

  const submitMutation = useMutation({
    mutationFn: async ({ data, schema }: { data: any; schema: any }) => {
      const hasFiles = Object.values(data).some((v) => v instanceof File);

      let response;
      if (hasFiles) {
        const formData = new FormData();
        const cleanData: any = {};

        for (const [key, value] of Object.entries(data)) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            cleanData[key] = value;
          }
        }

        formData.append("data", JSON.stringify(cleanData));
        formData.append("schema", JSON.stringify(schema));
        formData.append("refId", `REQ-${Date.now()}`);
        formData.append("workflowId", formMapping.workflowId || "");
        formData.append("createdBy", user?.email || "anonymous");
        console.log(formData);

        response = await fetch(`${Envs.API_URL}/api/submit`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${Envs.API_URL}/api/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data,
            schema,
            refId: `REQ-${Date.now()}`,
            workflowId: formMapping.workflowId || "",
            createdBy: user?.email || "anonymous",
          }),
        });
      }

      return response.json();
    },
    onSuccess: (result) => {
      console.log("Submission result:", result);
      if (result.success) {
        setModalContent({
          title: "Success",
          message: "Request submitted successfully!",
        });
        setModalOpen(true);
      } else {
        setModalContent({
          title: "Error",
          message: "Failed to submit",
        });
        setModalOpen(true);
      }
    },
    onError: (error: any) => {
      setModalContent({
        title: "Error",
        message: `Failed to submit: ${error.message}`,
      });
      setModalOpen(true);
    },
  });

  const handleModalClose = () => {
    setModalOpen(false);
    if (modalContent.title === "Success") {
      navigate(successPath);
    }
  };

  const handleSubmit = () => {
    if (validationErrors.length > 0) {
      setModalContent({
        title: "Validation Error",
        message: "Please fix validation errors before submitting.",
      });
      setModalOpen(true);
      return;
    }

    submitMutation.mutate({ data: formData, schema: formMapping.formSchema });
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
        {/* <Header
          breadcrumbs={[
            { label: "Home", path: homePath },
            { label: "New Request", path: newRequestPath },
            { label: formMapping?.name || "Form" },
          ]}
        /> */}
        {/* <Button variant="outlined" onClick={() => navigate(homePath)}>
          Back
        </Button> */}
      </Box>

      <Paper sx={{ p: 4, maxWidth: 800, margin: "0px auto" }}>
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
                onChange={({ data, errors }) => {
                  setFormData(data);
                  setValidationErrors(errors || []);
                }}
              />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitMutation.isPending || validationErrors.length > 0}
              sx={{ mt: 3 }}
            >
              {submitMutation.isPending ? (
                <CircularProgress size={24} />
              ) : (
                "Submit Request"
              )}
            </Button>
          </>
        )}
      </Paper>

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>{modalContent.title}</DialogTitle>
        <DialogContent>
          <Typography>{modalContent.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} variant="contained" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
