import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import SalesInvoice from "@/components/invoices/SalesInvoice";
import Head from "next/head";
import React from "react";

const title = "Nota Penjualan";

const BeginBalanceDebtDetailFormSlugPage: MyPage<{ id: string | string[] }> = ({
  id,
}) => {
  return (
    <>
      <Head>
        <title>{`Bidang Usaha | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SalesInvoice id={id as string} showIn="page" />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  const id = ctx.params?.id;

  if (!id) {
    return {
      props: {
        session,
      },
      redirect: {
        destination: "/sales",
        permanent: false,
      },
    };
  }

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
      id,
    },
  };
};

export default BeginBalanceDebtDetailFormSlugPage;
BeginBalanceDebtDetailFormSlugPage.Layout = "Dashboard";
