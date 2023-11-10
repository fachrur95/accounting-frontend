import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import PurchaseForm from "@/components/forms/transactions/PurchaseForm";
import type { FormSlugType } from "@/types/global";
import Head from "next/head";
import React from "react";
import { Role } from "@/types/prisma-api/role.d";

const title = "Pembelian";

const ProductFormSlugPage: MyPage = () => {
  const router = useRouter();
  const slug = router.query.slug;

  return (
    <>
      <Head>
        <title>{`Bidang Usaha | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PurchaseForm slug={slug as FormSlugType} showIn="page" />
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

export default ProductFormSlugPage;
ProductFormSlugPage.Layout = "Dashboard";
