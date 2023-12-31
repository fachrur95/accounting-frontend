import useNotification from "@/components/hooks/useNotification";
import type { FormSlugType } from "@/types/global";
import type { IDataOption } from "@/types/options";
import type { IAccountClass } from "@/types/prisma-api/account-class";
import type { IChartOfAccountMutation } from "@/types/prisma-api/chart-of-account";
import { api } from "@/utils/api";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FormContainer,
  SwitchElement,
  TextFieldElement,
  useForm,
  useWatch,
} from "react-hook-form-mui";
import AutocompleteAccountClass from "../controls/autocompletes/masters/AutocompleteAccountClass";
import AutocompleteAccountSubClass from "../controls/autocompletes/masters/AutocompleteAccountSubClass";

interface IChartOfAccountMutationWithAccountClass
  extends IChartOfAccountMutation {
  accountClass?: IDataOption | IAccountClass | null;
}

const defaultValues: IChartOfAccountMutationWithAccountClass = {
  accountSubClassId: "",
  code: "",
  group: "",
  name: "",
  isActive: true,
  accountSubClass: null,
  accountClass: null,
};

interface IMasterChartOfAccountForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const basePath = `/masters/chart-of-accounts`;

const MasterChartOfAccountForm = (props: IMasterChartOfAccountForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<IChartOfAccountMutationWithAccountClass>({
    defaultValues,
  });
  const { setOpenNotification } = useNotification();

  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.chartOfAccount.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const mutationCreate = api.chartOfAccount.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(
            field as keyof IChartOfAccountMutationWithAccountClass,
            {
              type: "custom",
              message: errors[field]?.join(", "),
            },
          );
        }
      }
    },
  });

  const mutationUpdate = api.chartOfAccount.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(
            field as keyof IChartOfAccountMutationWithAccountClass,
            {
              type: "custom",
              message: errors[field]?.join(", "),
            },
          );
        }
      }
    },
  });

  const selectedAccountClass = useWatch({ control, name: "accountClass" });

  const onSubmit = (data: IChartOfAccountMutationWithAccountClass) => {
    const dataSave = {
      ...data,
      group: data.group === "" || data.group === null ? undefined : data.group,
      accountSubClassId: data.accountSubClass?.id ?? "",
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
          if (key === "accountSubClass") {
            const selectedCategory = dataSelected[key]!;
            if (selectedCategory) {
              setValue("accountSubClass", {
                id: selectedCategory.id,
                label: selectedCategory.name,
              });
              if (selectedCategory.accountClass) {
                setValue("accountClass", {
                  id: selectedCategory.accountClass.id,
                  label: selectedCategory.accountClass.name,
                });
              }
            }
            continue;
          }
          if (
            key === "accountSubClassId" ||
            key === "code" ||
            key === "group" ||
            key === "name" ||
            key === "isActive"
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
            <Typography variant="h6">Bagan Akun</Typography>
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
              <AutocompleteAccountClass
                name="accountClass"
                label="Akun Utama"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
              <AutocompleteAccountSubClass
                name="accountSubClass"
                label="Sub Akun"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
                accountClassId={selectedAccountClass?.id ?? undefined}
              />
            </Box>
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
                autoFocus
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
            <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <SwitchElement
                name="isActive"
                label="Aktif"
                switchProps={{ disabled: mode === "view" }}
              />
            </Box>
            <Button type="submit" disabled={isSubmitting} className="hidden">
              Simpan
            </Button>
          </div>
        </FormContainer>
      </DialogContent>
    </>
  );
};

export default MasterChartOfAccountForm;
