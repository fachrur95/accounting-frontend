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
import AutocompleteChartOfAccount from "../controls/autocompletes/masters/AutocompleteChartOfAccount";
import { api } from "@/utils/api";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import type { FormSlugType } from "@/types/global";
import type { ICashRegisterMutation } from "@/types/prisma-api/cash-register";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
import HelpOutline from "@mui/icons-material/HelpOutline";
import Tooltip from "@mui/material/Tooltip";
import useSessionData from "@/components/hooks/useSessionData";

const defaultValues: ICashRegisterMutation = {
  mainAccountId: "",
  depositAccountId: "",
  beginBalanceAccountId: "",
  name: "",
  note: "",
  isActive: true,
  mainAccount: null,
  depositAccount: null,
  beginBalanceAccount: null,
};

interface IMasterCashRegisterForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const basePath = `/masters/other/cash-registers`;

const MasterCashRegisterForm = (props: IMasterCashRegisterForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const { data: sessionData, isFetching: isFetchingSession } = useSessionData();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<ICashRegisterMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.cashRegister.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const mutationCreate = api.cashRegister.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof ICashRegisterMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.cashRegister.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof ICashRegisterMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: ICashRegisterMutation) => {
    const dataSave = {
      ...data,
      note: data.note === "" || data.note === null ? undefined : data.note,
      mainAccountId: data.mainAccount?.id ?? "",
      depositAccountId: data.depositAccount?.id ?? "",
      beginBalanceAccountId: data.beginBalanceAccount?.id ?? "",
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
    if (sessionData && mode === "create") {
      const generalSetting = sessionData.session?.unit?.generalSetting;
      if (generalSetting) {
        if (generalSetting.defaultPaymentAccount) {
          setValue("depositAccountId", generalSetting.defaultPaymentAccount.id);
          setValue("depositAccount", {
            id: generalSetting.defaultPaymentAccount.id,
            label: `${generalSetting.defaultPaymentAccount.code} - ${generalSetting.defaultPaymentAccount.name}`,
          });

          setValue(
            "beginBalanceAccountId",
            generalSetting.defaultPaymentAccount.id,
          );
          setValue("beginBalanceAccount", {
            id: generalSetting.defaultPaymentAccount.id,
            label: `${generalSetting.defaultPaymentAccount.code} - ${generalSetting.defaultPaymentAccount.name}`,
          });
        }
      }
    }
  }, [sessionData, mode, setValue]);

  useEffect(() => {
    if (dataSelected) {
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
          if (key === "mainAccount") {
            const selectedCategory = dataSelected[key]!;
            if (selectedCategory) {
              setValue("mainAccount", {
                id: selectedCategory.id,
                label: selectedCategory.name,
              });
            }
            continue;
          }
          if (key === "depositAccount") {
            const selectedCategory = dataSelected[key]!;
            if (selectedCategory) {
              setValue("depositAccount", {
                id: selectedCategory.id,
                label: selectedCategory.name,
              });
            }
            continue;
          }
          if (key === "beginBalanceAccount") {
            const selectedCategory = dataSelected[key]!;
            if (selectedCategory) {
              setValue("beginBalanceAccount", {
                id: selectedCategory.id,
                label: selectedCategory.name,
              });
            }
            continue;
          }
          if (
            key === "mainAccountId" ||
            key === "depositAccountId" ||
            key === "beginBalanceAccountId" ||
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
        open={isFetchingSelected || isFetchingSession}
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
            <Typography variant="h6">Mesin Register</Typography>
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
              <Box className="flex w-full flex-row items-center gap-1">
                <AutocompleteChartOfAccount
                  name="mainAccount"
                  label="Akun Utama"
                  required
                  autocompleteProps={{
                    disabled: mode === "view",
                    fullWidth: true,
                  }}
                />
                <Tooltip
                  title="Akun Utama adalah akun yang akan menampung setiap kali mesin kasir menerima uang saat proses penjualan berlangsung. Secara Umum akun ini biasanya diisi dengan Kas Kecil. Ketika memiliki banyak mesin kasir, sebaiknya Akun Kas Kecil ditambah sesuai mesin kasir yang ada."
                  placement="top"
                  arrow
                >
                  <IconButton size="small">
                    <HelpOutline />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box className="flex w-full flex-row items-center gap-1">
                <AutocompleteChartOfAccount
                  name="depositAccount"
                  label="Akun Setoran"
                  required
                  autocompleteProps={{
                    disabled: mode === "view",
                    fullWidth: true,
                  }}
                />
                <Tooltip
                  title="Akun setoran adalah akun yang akan digunakan ketika setoran pada saat Kasir melakukan tutupan kasir. Misal disetorkan ke akun kas kembali atau akun lain yang Anda kehendaki."
                  placement="top"
                  arrow
                >
                  <IconButton size="small">
                    <HelpOutline />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box className="flex w-full flex-row items-center gap-1">
                <AutocompleteChartOfAccount
                  name="beginBalanceAccount"
                  label="Akun Saldo Awal"
                  required
                  autocompleteProps={{
                    disabled: mode === "view",
                    fullWidth: true,
                  }}
                />
                <Tooltip
                  title="Akun saldo awal adalah akun yang menjadi sumber atas kas awal ketika kasir melakukan bukaan kasir. Secara umum akun yang digunakan adalah akun kas."
                  placement="top"
                  arrow
                >
                  <IconButton size="small">
                    <HelpOutline />
                  </IconButton>
                </Tooltip>
              </Box>
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

export default MasterCashRegisterForm;
