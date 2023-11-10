import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
  FormContainer,
  TextFieldElement,
  // RadioButtonGroup,
  useForm,
} from "react-hook-form-mui";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import { api } from "@/utils/api";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import type { FormSlugType } from "@/types/global";
import type { IAccountClassMutation } from "@/types/prisma-api/account-class";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";

const defaultValues: IAccountClassMutation = {
  code: "",
  group: "",
  name: "",
  type: "AKTIVA",
  balanceSheetPosition: "POSITIVE",
};

interface IMasterAccountClassForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const basePath = "/masters/chart-of-accounts/classes";

const MasterAccountClassForm = (props: IMasterAccountClassForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<IAccountClassMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.accountClass.findOne.useQuery(
      { id: selectedId ?? "" },
      { enabled: !!selectedId, refetchOnWindowFocus: false },
    );

  const mutationCreate = api.accountClass.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IAccountClassMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.accountClass.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IAccountClassMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IAccountClassMutation) => {
    const dataSave: IAccountClassMutation = {
      ...data,
      group: data.group === "" || data.group === null ? undefined : data.group,
    };
    if (selectedId) {
      return void mutationUpdate.mutate({ ...dataSave, id: selectedId });
    }
    return void mutationCreate.mutate(dataSave);
  };

  useEffect(() => {
    const [path, id] = slug;
    if ((path === "f" || path === "v") && typeof id === "string") {
      setSelectedId(id);
    }
    if (path === "f" && typeof id === "string") {
      setMode("update");
    }
    if (path === "v" && typeof id === "string") {
      setMode("view");
    }
    if (path !== "f" && path !== "v") {
      setMode("create");
    }
  }, [slug]);

  useEffect(() => {
    if (dataSelected) {
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
          if (
            key === "code" ||
            key === "group" ||
            key === "name" ||
            key === "type" ||
            key === "balanceSheetPosition"
          ) {
            setValue(key, dataSelected[key]);
          }
        }
      }
    }
  }, [dataSelected, setValue]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetchingSelected}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* component={showIn === "page" ? Paper : undefined} */}
      <DialogTitle>
        <Box
          component={showIn === "page" ? Paper : undefined}
          className={`flex items-center justify-between ${
            showIn === "page" ? "px-4 py-2" : ""
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <Link href={basePath}>
              <IconButton color="error">
                <Close />
              </IconButton>
            </Link>
            <Typography variant="h6">Akun Utama</Typography>
          </div>
          <div>
            {mode === "view" && selectedId ? (
              <Button
                variant="contained"
                type="button"
                size="large"
                fullWidth
                startIcon={<Edit />}
                onClick={() => router.push(`${basePath}/f/${selectedId}`)}
              >
                Sunting
              </Button>
            ) : (
              <Button
                variant="contained"
                // type="submit"
                color="success"
                size="large"
                disabled={isSubmitting}
                fullWidth
                startIcon={<Save />}
                onClick={() => handleSubmit(onSubmit)()}
              >
                Simpan
              </Button>
            )}
          </div>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
          <div className="grid gap-4">
            <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextFieldElement
                name="code"
                label="Kode"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
              />
              <TextFieldElement
                name="name"
                label="Nama"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
              />
              <TextFieldElement
                name="group"
                label="Label"
                InputProps={{
                  disabled: mode === "view",
                }}
              />
            </Box>
            {/* <Box
              component={Paper}
              
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <RadioButtonGroup
                label="Posisi Akun"
                name="type"
                options={[
                  {
                    id: "AKTIVA",
                    label: "Aktiva",
                  },
                  {
                    id: "PASIVA",
                    label: "Pasiva",
                  },
                ]}
                row
                required
              />
              <RadioButtonGroup
                label="Posisi dalam Neraca"
                name="balanceSheetPosition"
                options={[
                  {
                    id: "POSITIVE",
                    label: "POSITIVE",
                  },
                  {
                    id: "NEGATIVE",
                    label: "NEGATIVE",
                  },
                ]}
                row
                required
              />
            </Box> */}
            <Button type="submit" disabled={isSubmitting} className="hidden">
              Simpan
            </Button>
          </div>
        </FormContainer>
      </DialogContent>
    </>
  );
};

export default MasterAccountClassForm;
