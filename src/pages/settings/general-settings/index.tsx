import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import useSessionData from "@/components/hooks/useSessionData";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import type { IGeneralSettingMutation } from "@/types/prisma-api/general-setting";
import useNotification from "@/components/hooks/useNotification";
import Save from "@mui/icons-material/Save";
import AutocompleteChartOfAccount from "@/components/controls/autocompletes/masters/AutocompleteChartOfAccount";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import { api } from "@/utils/api";
import {
  FormContainer,
  RadioButtonGroup,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import React, { useEffect } from "react";
import { Role } from "@/types/prisma-api/role.d";
import { RecalculateMethod } from "@/types/prisma-api/recalculate-method.d";

const title = "Pengaturan Umum";

const basePath = "/settings/general-settings";

const defaultValues: IGeneralSettingMutation = {
  companyName: "",
  leader: "",
  accountant: "",
  recalculateMethod: RecalculateMethod.FIFO,
  currentProfitAccountId: "",
  debitAccountId: "",
  creditAccountId: "",
  currentProfitAccount: null,
  debitAccount: null,
  creditAccount: null,
};

const GeneralSettingsPage: MyPage = () => {
  const router = useRouter();
  const { data: sessionData, isFetching } = useSessionData();
  const formContext = useForm<IGeneralSettingMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();
  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = formContext;

  const mutation = api.generalSetting.update.useMutation({
    // onSuccess: () => void router.push(basePath),
    onSuccess: () => {
      setOpenNotification("Pengaturan Umum telah diubah");
      void router.push(basePath);
    },
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IGeneralSettingMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IGeneralSettingMutation) => {
    const dataSave = {
      ...data,
      leader: data.leader ?? undefined,
      accountant: data.accountant ?? undefined,
      currentProfitAccountId: data.currentProfitAccount?.id ?? null,
      debitAccountId: data.debitAccount?.id ?? null,
      creditAccountId: data.creditAccount?.id ?? null,
    };
    console.log({ dataSave });
    return void mutation.mutate(dataSave);
  };

  useEffect(() => {
    if (sessionData) {
      const generalSetting = sessionData.session?.unit?.generalSetting;
      if (generalSetting) {
        setValue("companyName", generalSetting.companyName);
        setValue("leader", generalSetting.leader ?? "");
        setValue("accountant", generalSetting.accountant ?? "");
        setValue("recalculateMethod", generalSetting.recalculateMethod);
        if (generalSetting.creditAccount) {
          setValue("creditAccountId", generalSetting.creditAccount.id);
          setValue("creditAccount", {
            id: generalSetting.creditAccount.id,
            label: `${generalSetting.creditAccount.code} - ${generalSetting.creditAccount.name}`,
          });
        }
        if (generalSetting.debitAccount) {
          setValue("debitAccountId", generalSetting.debitAccount.id);
          setValue("debitAccount", {
            id: generalSetting.debitAccount.id,
            label: `${generalSetting.debitAccount.code} - ${generalSetting.debitAccount.name}`,
          });
        }
        if (generalSetting.currentProfitAccount) {
          setValue(
            "currentProfitAccountId",
            generalSetting.currentProfitAccount.id,
          );
          setValue("currentProfitAccount", {
            id: generalSetting.currentProfitAccount.id,
            label: `${generalSetting.currentProfitAccount.code} - ${generalSetting.currentProfitAccount.name}`,
          });
        }
      }
    }
  }, [sessionData, setValue]);

  return (
    <>
      <Head>
        <title>{`Bidang Usaha | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetching}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box className="flex flex-col gap-2">
        <Box
          component={Paper}
          elevation={4}
          className="relative w-full flex-grow p-4"
        >
          <Box className="mb-2 flex flex-col items-center md:flex-row md:justify-between">
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <div>
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
            </div>
          </Box>
          <FormContainer formContext={formContext} onSuccess={onSubmit}>
            <Box
              component={Paper}
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4"
            >
              <TextFieldElement name="companyName" label="Nama Unit" required />
              <TextFieldElement name="leader" label="Ka. Unit" required />
              <TextFieldElement name="accountant" label="Akuntan" required />
              <RadioButtonGroup
                label="Metode Perhitungan HPP (Harga Pokok Penjualan)"
                name="recalculateMethod"
                required
                options={[
                  {
                    id: "FIFO",
                    label: "FIFO (First In First Out)",
                  },
                  {
                    id: "AVG",
                    label: "AVERAGE (Rata-Rata)",
                  },
                  {
                    id: "MANUAL",
                    label: "MANUAL (Manual diatur dari Produk)",
                  },
                ]}
              />
              <AutocompleteChartOfAccount
                name="currentProfitAccount"
                label="Saldo Laba Berjalan"
                required
              />
              <AutocompleteChartOfAccount
                name="debitAccount"
                label="Akun Hutang"
                required
              />
              <AutocompleteChartOfAccount
                name="creditAccount"
                label="Akun Piutang"
                required
              />
            </Box>
          </FormContainer>
        </Box>
      </Box>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  const accessToken = session.accessToken;
  const tokenData = jwtDecode<IJwtDecode>(accessToken);
  if (!tokenData.session?.institute) {
    return {
      redirect: {
        destination: "/credentials/institute",
        permanent: false,
      },
    };
  }
  if (!tokenData.session?.unit) {
    return {
      redirect: {
        destination: "/credentials/unit",
        permanent: false,
      },
    };
  }
  if (session.user.role === Role.USER) {
    return {
      redirect: {
        destination: "/not-found",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default GeneralSettingsPage;
GeneralSettingsPage.Layout = "Dashboard";
