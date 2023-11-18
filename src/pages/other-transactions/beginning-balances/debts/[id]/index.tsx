import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import BeginningBalanceDebtReceivableDetailForm from "@/components/forms/begin-balances/BeginningBalanceDebtReceivableDetailForm";
import Head from "next/head";
import React from "react";
import { Role } from "@/types/prisma-api/role.d";

const title = "Saldo Awal Hutang";

const BeginBalanceDebtDetailFormSlugPage: MyPage<{ id: string | string[] }> = ({
  id,
}) => {
  return (
    <>
      <Head>
        <title>{`Bidang Usaha | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BeginningBalanceDebtReceivableDetailForm
        id={id as string}
        showIn="page"
        type="debt"
      />
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
        destination: "/other-transactions/beginning-balances/debts",
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
      id,
    },
  };
};

export default BeginBalanceDebtDetailFormSlugPage;
BeginBalanceDebtDetailFormSlugPage.Layout = "Dashboard";
