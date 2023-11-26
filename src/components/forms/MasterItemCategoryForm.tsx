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
  useWatch,
} from "react-hook-form-mui";
import type { IDataOption } from "@/types/options";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import HelpOutline from "@mui/icons-material/HelpOutline";
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
import useNotification from "@/components/hooks/useNotification";
import Tooltip from "@mui/material/Tooltip";

const defaultValues: IItemCategoryMutation = {
  itemTypeId: "",
  salesAccountId: "",
  stockAccountId: "",
  cogsAccountId: "",
  name: "",
  note: "",
  isActive: true,
  itemType: null,
  salesAccount: null,
  stockAccount: null,
  cogsAccount: null,
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
  const { setOpenNotification } = useNotification();

  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.itemCategory.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const itemTypeSelected: IDataOption | null = useWatch({
    control,
    name: "itemType",
  });
  console.log({ itemTypeSelected });

  const mutationCreate = api.itemCategory.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
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
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
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
    const dataSave = {
      ...data,
      note: data.note === "" || data.note === null ? undefined : data.note,
      itemTypeId: data.itemType?.id ?? "",
      salesAccountId: data.salesAccount?.id ?? "",
      stockAccountId:
        itemTypeSelected?.isStock === true
          ? data.stockAccount?.id ?? ""
          : undefined,
      cogsAccountId:
        itemTypeSelected?.isStock === true
          ? data.cogsAccount?.id ?? ""
          : undefined,
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
          if (key === "salesAccount") {
            const selectedAccount = dataSelected[key]!;
            if (selectedAccount) {
              setValue("salesAccount", {
                id: selectedAccount.id,
                label: selectedAccount.name,
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
            key === "salesAccountId" ||
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
                name="name"
                label="Nama"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
                autoFocus
              />
            </Box>
            <Box
              component={Paper}
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
              <Box className="flex w-full flex-row items-center gap-1">
                <AutocompleteChartOfAccount
                  name="salesAccount"
                  label="Akun Penjualan"
                  required
                  autocompleteProps={{
                    disabled: mode === "view",
                    fullWidth: true,
                  }}
                />
                <Tooltip
                  title="Akun ini adalah akun yang berkaitan dengan ketika barang yang bersangkutan dijual. Dan Akun ini lah yang akan dibandingkan dengan akun HPP dalam menentukan laba/rugi suatu barang. Ketika barang jasa, maka HPPnya tidak ada berarti laba/rugi akan dikurangi terhadap 0"
                  placement="top"
                  arrow
                >
                  <IconButton size="small">
                    <HelpOutline />
                  </IconButton>
                </Tooltip>
              </Box>
              {itemTypeSelected?.isStock === true && (
                <Box className="flex w-full flex-row items-center gap-1">
                  <AutocompleteChartOfAccount
                    name="stockAccount"
                    label={`Akun Modal/Persediaan`}
                    autocompleteProps={{
                      disabled: mode === "view",
                      fullWidth: true,
                    }}
                    required={itemTypeSelected?.isStock === true}
                  />
                  <Tooltip
                    title="Akun ini adalah akun yang berkaitan dengan persediaan barang. Dengan kata lain akun ini adalah akun yg akan menampung persediaan ketika barang yang bersangkutan di-restock/ dibeli. Akun ini wajib diisi hanya ketika tipe barang bersifat distock/ barang bukan jasa. Pada umumnya akun ini diisi akun persediaan"
                    placement="top"
                    arrow
                  >
                    <IconButton size="small">
                      <HelpOutline />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
              {itemTypeSelected?.isStock === true && (
                <Box className="flex w-full flex-row items-center gap-1">
                  <AutocompleteChartOfAccount
                    name="cogsAccount"
                    label="Akun HPP"
                    autocompleteProps={{
                      disabled: mode === "view",
                      fullWidth: true,
                    }}
                    required={itemTypeSelected?.isStock === true}
                  />
                  <Tooltip
                    title="Akun ini adalah akun yang berkaitan dengan HPP (Harga Pokok Penjualan). Akun yang akan menampung HPP dari barang yang bersangkutan. Akun ini wajib diisi hanya ketika tipe barang bersifat distock/ barang bukan jasa. Pada umumnya akun ini diisi akun persediaan"
                    placement="top"
                    arrow
                  >
                    <IconButton size="small">
                      <HelpOutline />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            </Box>
            <Box
              component={Paper}
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
