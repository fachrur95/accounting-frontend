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
import type { IUserAccountUpdateMutation } from "@/types/prisma-api/user";
import useNotification from "@/components/hooks/useNotification";
import Save from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
import { api } from "@/utils/api";
import {
  FormContainer,
  PasswordElement,
  PasswordRepeatElement,
  TextFieldElement,
  useForm,
  useWatch,
} from "react-hook-form-mui";
import React, { useEffect } from "react";

const title = "Profil";

const defaultValues: IUserAccountUpdateMutation = {
  email: "",
  name: "",
  password: "",
  newPassword: "",
};

const ProfilePage: MyPage = () => {
  const { data: sessionData, isFetching, refetch } = useSessionData();
  const formContext = useForm<IUserAccountUpdateMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = formContext;

  const newPassword = useWatch({ control, name: "newPassword" });

  const mutation = api.session.update.useMutation({
    // onSuccess: () => void router.push(basePath),
    onSuccess: () => {
      setOpenNotification("Profil telah diubah");
      void refetch();
    },
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IUserAccountUpdateMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IUserAccountUpdateMutation) => {
    const dataSave: IUserAccountUpdateMutation = {
      ...data,
    };
    console.log({ dataSave });
    return void mutation.mutate(dataSave);
  };

  useEffect(() => {
    if (sessionData) {
      setValue("email", sessionData.email);
      setValue("name", sessionData.name ?? "");
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
            <div className="grid gap-4">
              <Box
                component={Paper}
                variant="outlined"
                className="grid grid-cols-1 gap-4 p-4"
              >
                <TextFieldElement
                  name="email"
                  label="Alamat Surel"
                  required
                  disabled
                />
                <TextFieldElement name="name" label="Nama Lengkap" required />
                <PasswordElement
                  name="password"
                  label="Kata Sandi"
                  type="password"
                  required
                  fullWidth
                />
              </Box>
              <Box
                component={Paper}
                variant="outlined"
                className="grid grid-cols-1 gap-4 p-4"
              >
                <PasswordElement label="Kata Sandi Baru" name="newPassword" />
                {newPassword !== "" &&
                  newPassword !== null &&
                  newPassword !== undefined && (
                    <PasswordRepeatElement
                      passwordFieldName="newPassword"
                      name="password-repeat"
                      label="Konfirmasi Kata Sandi Baru"
                    />
                  )}
              </Box>
            </div>
            <Button type="submit" disabled={isSubmitting} className="hidden">
              Simpan
            </Button>
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

  return {
    props: {
      session,
    },
  };
};

export default ProfilePage;
ProfilePage.Layout = "Dashboard";
