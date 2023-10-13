import DeleteMultiple from "@/components/displays/DeleteMultiple";
import type { MyPage } from "@/components/layouts/layoutTypes";
import DataGridProAdv from "@/components/tables/datagrid/DataGridProAdv";
import { getServerAuthSession } from "@/server/auth";
import type { PaginationResponse } from "@/types/api-response";
import { api } from "@/utils/api";
import { convertOperator } from "@/utils/helpers";
import { useAppStore } from "@/utils/store";
import Refresh from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type {
  GridColDef,
  GridFilterModel,
  GridInputSelectionModel,
  GridRenderCellParams,
  GridSelectionModel,
  GridSortModel,
  GridValueGetterParams,
} from "@mui/x-data-grid-pro";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import CustomMenu from "@/components/displays/StyledMenu";
import NavTabs from "@/components/tabs";
import { productTabs } from "@/components/tabs/data";
import { useRouter } from "next/router";
import ModalTransition from "@/components/dialogs/ModalTransition";
import MasterUnitOfMeasureForm from "@/components/forms/MasterUnitOfMeasureForm";
import type { FormSlugType } from "@/types/global";
import type { IJwtDecode } from "@/types/session";
import type { IUnitOfMeasure } from "@/types/prisma-api/unit-of-measure";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import type { WorkerPathType } from "@/types/worker";

const sortDefault: GridSortModel = [{ field: "name", sort: "asc" }];

const title = "Satuan Ukur";
const path: WorkerPathType = "unit-of-measure";

const UnitOfMeasuresPage: MyPage = () => {
  return <div>UnitOfMeasuresPage</div>;
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

export default UnitOfMeasuresPage;
UnitOfMeasuresPage.Layout = "Dashboard";
