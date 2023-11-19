import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import React from "react";
import CopyrightInfo from "@/components/displays/CopyrightInfo";
import LoadingButton from "@mui/lab/LoadingButton";
import Head from "next/head";
import Image from "next/image";
import {
  FormContainer,
  PasswordElement,
  PasswordRepeatElement,
  useForm,
} from "react-hook-form-mui";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
import { api } from "@/utils/api";

type ResetPasswordFormType = {
  password: string;
};

const defaultValues: ResetPasswordFormType = {
  password: "",
};

const RegistrationPage: MyPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const { setOpenNotification } = useNotification();
  const formContext = useForm<ResetPasswordFormType>({ defaultValues });

  const {
    formState: { isSubmitting },
  } = formContext;

  const mutation = api.email.resetPassword.useMutation();

  const onSubmit = async (data: ResetPasswordFormType) => {
    // console.log({ data });
    await mutation.mutateAsync(
      { ...data, token },
      {
        onError: (err) => console.log(err),
        onSuccess: (response) => {
          setOpenNotification(response.message ?? "No Message Receive");
          void router.push("/auth");
        },
      },
    );
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Bidang Usaha | Reset Kata Sandi`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container component="main" maxWidth={false}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "75vh",
            justifyContent: "center",
          }}
        >
          <Box
            component={Paper}
            elevation={4}
            sx={{
              alignItems: "center",
              justifyContent: "center",
            }}
            className="w-[98%] p-8 md:w-[65%] lg:w-[50%] xl:w-[35%]"
          >
            <div className="flex items-center justify-center">
              <Image
                alt="Logo"
                src="/img/logo-p2s3.png"
                quality={100}
                width={200}
                height={100}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
                className="text-center"
              />
            </div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                className="text-lg font-semibold md:text-3xl 2xl:text-3xl"
                gutterBottom
              >
                Reset Kata Sandi
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-light"
                color="gray"
              >
                Masukan kata sandi baru
              </Typography>
              <Box className="w-full">
                <FormContainer formContext={formContext} onSuccess={onSubmit}>
                  <Box className="grid grid-cols-1 gap-4">
                    <PasswordElement
                      name="password"
                      label="Kata Sandi"
                      type="password"
                      required
                      fullWidth
                    />
                    <PasswordRepeatElement
                      passwordFieldName="password"
                      name="password-repeat"
                      label="Konfirmasi Kata Sandi"
                      required
                    />
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      loading={isSubmitting}
                      size="large"
                    >
                      Reset
                    </LoadingButton>
                  </Box>
                </FormContainer>
              </Box>
            </Box>
          </Box>
        </Box>
        <CopyrightInfo />
      </Container>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  const token = ctx.params?.token;

  if (!token) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      token,
    },
  };
};

export default RegistrationPage;
RegistrationPage.Layout = "Image";
