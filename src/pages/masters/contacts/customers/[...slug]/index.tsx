import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import MasterPeopleForm from "@/components/forms/MasterPeopleForm";
import type { FormSlugType } from "@/types/global";
import Head from "next/head";
import React from "react";

const title = "Pelanggan";

const ProductFormSlugPage: MyPage = () => {
  const router = useRouter();
  const slug = router.query.slug;

  return (
    <>
      <Head>
        <title>{`Gogabook | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <MasterPeopleForm
        slug={slug as FormSlugType}
        showIn="page"
        forType="customer"
      />
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

export default ProductFormSlugPage;
ProductFormSlugPage.Layout = "Dashboard";
