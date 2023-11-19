import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import React from "react";
import CopyrightInfo from "@/components/displays/CopyrightInfo";
import LoadingButton from "@mui/lab/LoadingButton";
import Head from "next/head";
import Image from "next/image";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
import MuiLink from "@mui/material/Link";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import { api } from "@/utils/api";

type SignInFormType = {
  email: string;
};

const defaultValues: SignInFormType = {
  email: "",
};

const ForgotPasswordPage: MyPage = () => {
  // const router = useRouter();
  const { setOpenNotification } = useNotification();
  const formContext = useForm<SignInFormType>({ defaultValues });

  const {
    formState: { isSubmitting },
  } = formContext;

  const mutation = api.email.forgotPassword.useMutation();

  const onSubmit = async (data: SignInFormType) => {
    await mutation.mutateAsync(data, {
      onError: (err) => console.log(err),
      onSuccess: (response: { message: string }) => {
        if (response.message) {
          return void setOpenNotification(response.message);
        }
        // if (!response) {
        // }
        // void router.push("/forgot-password/sent");
      },
    });
    /* const register = await signIn("register", {
      ...data,
      redirect: false,
      callbackUrl: "/credentials/institute",
    });
    console.log({ register });
    if (!register) {
      return setOpenNotification("Register bermasalah, harap diulang kembali", {
        variant: "error",
      });
    }
    if (register.ok) {
      return router.push(register.url ?? "/");
    }
    if (register.error) {
      setOpenNotification(register.error, { variant: "error" });
    } */
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Bidang Usaha | Pendaftaran`}</title>
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
                Lupa Kata Sandi
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-light"
                color="gray"
              >
                Masukan alamat surel yang terdaftar
              </Typography>
              {/* {Object.values(providers).map(
                (provider: Record<string, string>) => (
                  <div key={provider.id}>{JSON.stringify(provider)}</div>
                )
              )} */}
              <Box className="w-full">
                <FormContainer formContext={formContext} onSuccess={onSubmit}>
                  <Box className="grid grid-cols-1 gap-4">
                    <TextFieldElement
                      name="email"
                      type="email"
                      label="Alamat Surel"
                      required
                      autoFocus
                      fullWidth
                    />
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      loading={isSubmitting}
                      size="large"
                    >
                      Kirim Permintaan
                    </LoadingButton>
                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link href="/auth" passHref>
                          <MuiLink variant="body2">
                            {"Telah mengingat kata sandi? Masuk"}
                          </MuiLink>
                        </Link>
                      </Grid>
                    </Grid>
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
    },
  };
};

export default ForgotPasswordPage;
ForgotPasswordPage.Layout = "Image";
