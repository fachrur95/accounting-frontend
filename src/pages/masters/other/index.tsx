import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import React from "react";
import { Role } from "@/types/prisma-api/role.d";

const MasterOthersPage: MyPage = () => {
  return <div>MasterOthersPage</div>;
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
    redirect: {
      destination: "/masters/other/cash-registers",
      permanent: false,
    },
  };
};

export default MasterOthersPage;
MasterOthersPage.Layout = "Dashboard";
