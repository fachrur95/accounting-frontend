import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Summarize from "@mui/icons-material/Summarize";
import Head from "next/head";
import Link from "next/link";
import { Role } from "@/types/prisma-api/role.d";
import { Typography } from "@mui/material";

const title = "Daftar Laporan";

const dataReports = [
  {
    title: "Penjualan",
  },
  {
    icon: <Summarize />,
    title: "Penjualan - Ringkas",
    url: "/reports/sales-summary",
  },
  {
    icon: <Summarize />,
    title: "Penjualan - Rinci",
    url: "/reports/sales-detail",
  },
  {
    title: "Pembelian",
  },
  {
    icon: <Summarize />,
    title: "Pembelian - Ringkas",
    url: "/reports/purchase-summary",
  },
  {
    icon: <Summarize />,
    title: "Pembelian - Rinci",
    url: "/reports/purchase-detail",
  },
  {
    title: "Hutang-Piutang",
  },
  {
    icon: <Summarize />,
    title: "Hutang",
    url: "/reports/debt",
  },
  {
    icon: <Summarize />,
    title: "Piutang",
    url: "/reports/receivable",
  },
  {
    title: "Kas dan Bank",
  },
  {
    icon: <Summarize />,
    title: "Arus Kas",
    url: "/reports/cash-flow",
  },
  {
    icon: <Summarize />,
    title: "Rekening Bank",
    url: "/reports/bank-summary",
  },
  {
    title: "Lain-lain",
  },
  {
    icon: <Summarize />,
    title: "Neraca",
    url: "/reports/balance-sheet",
  },
  {
    icon: <Summarize />,
    title: "Laba Rugi",
    url: "/reports/profit-loss",
  },
  {
    icon: <Summarize />,
    title: "Barang Terlaris",
    url: "/reports/best-selling-product",
  },
  {
    icon: <Summarize />,
    title: "Sisa Stock",
    url: "/reports/remaining-stock",
  },
];

const ReportsPage: MyPage = () => {
  return (
    <>
      <Head>
        <title>{`Bidang Usaha | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
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
          </Box>
          <Box component={Paper} sx={{ width: "100%" }}>
            <nav aria-label="main mailbox folders">
              <List
                sx={{
                  position: "relative",
                  overflow: "auto",
                  maxHeight: "80vh",
                }}
                /* subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Daftar Laporan
                  </ListSubheader>
                } */
              >
                {dataReports.map((report, index) =>
                  report.url && report.icon ? (
                    <Link
                      key={index}
                      href={report.url}
                      className="text-[#202020] no-underline transition-all duration-300 dark:text-white"
                    >
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>{report.icon}</ListItemIcon>
                          <ListItemText primary={report.title} />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ) : (
                    <ListSubheader key={index}>{report.title}</ListSubheader>
                  ),
                )}
              </List>
            </nav>
          </Box>
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

export default ReportsPage;
ReportsPage.Layout = "Dashboard";
