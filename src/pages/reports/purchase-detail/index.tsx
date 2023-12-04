import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { IJwtDecode } from "@/types/session";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Head from "next/head";
import type { FilterReportType } from "@/types/global";
import { FormContainer, useForm, useWatch } from "react-hook-form-mui";
import DatePicker from "@/components/controls/DatePicker";
import Button from "@mui/material/Button";
import PlayArrow from "@mui/icons-material/PlayArrow";
import { type AxiosRequestConfig } from "axios";
// import axiosSSR from "@/utils/axios/axiosSSR";
import axios from "axios";
import { useSession } from "next-auth/react";
import { startOfMonth, endOfMonth } from "date-fns";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import AutocompletePeople from "@/components/controls/autocompletes/masters/AutocompletePeople";
import type { IDataOption } from "@/types/options";
import { Role } from "@/types/prisma-api/role.d";

const title = "Laporan Pembelian - Rinci";

type FilterReportExtends = FilterReportType & {
  people: IDataOption | null;
};

const PurchaseDetailReportPage: MyPage = () => {
  const { data: sessionData } = useSession();
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);
  const date = new Date(); // Misalnya, gunakan tanggal saat ini
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  const defaultValues: FilterReportExtends = {
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth,
    people: null,
  };
  const formContext = useForm<FilterReportExtends>({ defaultValues });

  const {
    control,
    formState: { isSubmitting },
  } = formContext;

  const startDate = useWatch({ control, name: "startDate" });
  const endDate = useWatch({ control, name: "endDate" });

  const onSubmit = async (data: FilterReportExtends) => {
    const config: AxiosRequestConfig = {
      url: `/api/pdf/transaction-detail?type=purchase&startDate=${data.startDate.toISOString()}&endDate=${data.endDate.toISOString()}${
        data.people ? `&peopleId=${data.people.id}` : ""
      }`,
      method: "GET",
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${sessionData?.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/pdf",
      },
    };
    await axios<Buffer>(config)
      .then((result) => {
        const blob = new Blob([result.data as BlobPart], {
          type: "application/pdf",
        });
        const path = window.URL.createObjectURL(blob);
        setPdfBlob(path);
      })
      .catch((err: { response: { data: { message: string } } }) => {
        const responseErr = err.response.data;
        console.log({ responseErr });
      });
  };

  return (
    <>
      <Head>
        <title>{`Bidang Usaha | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box component={Paper} className="flex h-[88vh] w-full flex-col gap-2">
        <Box className="flex items-center gap-2 px-4 py-2">
          <Link href="/reports">
            <IconButton color="error">
              <Close />
            </IconButton>
          </Link>
          <Typography variant="h5">{title}</Typography>
        </Box>
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <DatePicker
              label="Mulai"
              name="startDate"
              maxDate={endDate}
              required
            />
            <DatePicker
              label="Hingga"
              name="endDate"
              minDate={startDate}
              required
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<PlayArrow />}
              disabled={isSubmitting}
            >
              Terapkan
            </Button>
            <AutocompletePeople name="people" label="Pemasok" type="supplier" />
          </Box>
        </FormContainer>
        {/* {pdfBlob && (
          <object
            data={pdfBlob}
            type="application/pdf"
            width="100%"
            className="flex-grow"
          >
            PDF Viewer
          </object>
        )} */}
        {pdfBlob && (
          <embed
            src={pdfBlob}
            width="100%"
            className="flex-grow border-0"
          ></embed>
        )}
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

export default PurchaseDetailReportPage;
PurchaseDetailReportPage.Layout = "Dashboard";
