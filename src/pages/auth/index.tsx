import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import { type GetServerSideProps } from "next";
import React from "react";
import CopyrightInfo from "@/components/displays/CopyrightInfo";
import LoadingButton from "@mui/lab/LoadingButton";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import {
  FormContainer,
  PasswordElement,
  TextFieldElement,
  useForm,
} from "react-hook-form-mui";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";

type SignInFormType = {
  email: string;
  password: string;
};

const defaultValues: SignInFormType = {
  email: "",
  password: "",
};

const AuthPage: MyPage = () => {
  const router = useRouter();
  const { setOpenNotification } = useNotification();
  const formContext = useForm<SignInFormType>({ defaultValues });

  const {
    formState: { isSubmitting },
  } = formContext;

  const onSubmit = async (data: SignInFormType) => {
    // console.log({ data });
    const login = await signIn("next-auth", {
      ...data,
      redirect: false,
      callbackUrl: "/credentials/institute",
    });
    console.log({ login });
    if (!login) {
      return setOpenNotification("Login bermasalah, mohon diulang kembali", {
        variant: "error",
      });
    }
    if (login.ok) {
      return router.push(login.url ?? "/");
    }
    if (login.error) {
      setOpenNotification(login.error, { variant: "error" });
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>{`Bidang Usaha | Bidang Usaha`}</title>
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
                className="text-lg font-semibold md:text-3xl 2xl:text-6xl"
                gutterBottom
              >
                Bidang Usaha
              </Typography>
              <Typography
                variant="subtitle2"
                className="font-light"
                color="gray"
              >
                Masuk dengan Akun Bidang Usaha
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
                      label="Alamat Surel"
                      required
                      autoFocus
                      fullWidth
                    />
                    <PasswordElement
                      name="password"
                      label="Kata Sandi"
                      type="password"
                      required
                      fullWidth
                    />
                    <LoadingButton
                      type="submit"
                      fullWidth
                      variant="contained"
                      loading={isSubmitting}
                      size="large"
                    >
                      Masuk
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

export default AuthPage;
AuthPage.Layout = "Image";
