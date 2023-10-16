import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
  FormContainer,
  SwitchElement,
  TextFieldElement,
  TextareaAutosizeElement,
  useForm,
} from "react-hook-form-mui";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import AutocompleteItemType from "../controls/autocompletes/masters/AutocompleteItemType";
import AutocompleteChartOfAccount from "../controls/autocompletes/masters/AutocompleteChartOfAccount";
import { api } from "@/utils/api";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import type { FormSlugType } from "@/types/global";
import type { IItemCategoryMutation } from "@/types/prisma-api/item-category";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
// import type { IItemCategory } from "@/types/prisma-api/item-category";

/* type MasterItemBodyType = IItemCategoryMutation & {
  itemCategory: IDataOption | IItemCategory | null;
  tax: IDataOption | ITax | null;
}; */

const defaultValues: IItemCategoryMutation = {
  itemTypeId: "",
  stockAccountId: "",
  cogsAccountId: "",
  name: "",
  note: "",
  isActive: true,
  itemType: null,
};

interface IMasterItemCategoryForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const basePath = `/masters/products/categories`;

const MasterItemCategoryForm = (props: IMasterItemCategoryForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<IItemCategoryMutation>({ defaultValues });

  const {
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.itemCategory.findOne.useQuery(
      { id: selectedId ?? "" },
      { enabled: !!selectedId, refetchOnWindowFocus: false },
    );

  const mutationCreate = api.itemCategory.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IItemCategoryMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.itemCategory.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IItemCategoryMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IItemCategoryMutation) => {
    const dataSave: IItemCategoryMutation = {
      ...data,
      note: data.note === "" || data.note === null ? undefined : data.note,
      itemTypeId: data.itemType?.id ?? "",
      stockAccountId: data.stockAccount?.id ?? undefined,
      cogsAccountId: data.cogsAccount?.id ?? undefined,
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
          if (key === "itemType") {
            const selectedType = dataSelected[key]!;
            if (selectedType) {
              setValue("itemType", {
                id: selectedType.id,
                label: selectedType.name,
              });
            }
            continue;
          }
          if (key === "stockAccount") {
            const selectedAccount = dataSelected[key]!;
            if (selectedAccount) {
              setValue("stockAccount", {
                id: selectedAccount.id,
                label: selectedAccount.name,
              });
            }
            continue;
          }
          if (key === "cogsAccount") {
            const selectedAccount = dataSelected[key]!;
            if (selectedAccount) {
              setValue("cogsAccount", {
                id: selectedAccount.id,
                label: selectedAccount.name,
              });
            }
            continue;
          }
          if (
            key === "itemTypeId" ||
            key === "stockAccountId" ||
            key === "cogsAccountId" ||
            key === "name" ||
            key === "note" ||
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
            <Typography variant="h6">Kategori</Typography>
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
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextFieldElement
                name="name"
                label="Nama"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
              />
            </Box>
            <Box
              component={Paper}
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <AutocompleteItemType
                name="itemType"
                label="Tipe Produk"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
              <AutocompleteChartOfAccount
                name="stockAccount"
                label="Akun Modal/Stock (optional)"
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
              <AutocompleteChartOfAccount
                name="cogsAccount"
                label="Akun HPP (optional)"
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
            </Box>
            <Box
              component={Paper}
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextareaAutosizeElement
                name="note"
                label="Catatan"
                rows={3}
                className="col-start-1"
                disabled={mode === "view"}
              />
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

export default MasterItemCategoryForm;
