import DeleteMultiple from "@/components/displays/DeleteMultiple";
import type { MyPage } from "@/components/layouts/layoutTypes";
import DataGridProAdv from "@/components/tables/datagrid/DataGridProAdv";
import { getServerAuthSession } from "@/server/auth";
import type { PaginationResponse } from "@/types/api-response";
import { api } from "@/utils/api";
import { convertOperator } from "@/utils/helpers";
import { useAppStore } from "@/utils/store";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Refresh from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Done from "@mui/icons-material/Done";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Chip,
  DialogContent,
  // DialogTitle,
  IconButton,
  Link as MuiLink,
  Paper,
  Typography,
} from "@mui/material";
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
// import { LoadingPage } from "@/components/layouts/LoadingPage";
// import useNotification from "@/components/hooks/useNotification";
import CustomMenu from "@/components/displays/StyledMenu";
import NavTabs from "@/components/tabs";
import { productTabs } from "@/components/tabs/data";
import { useRouter } from "next/router";
import ModalTransition from "@/components/dialogs/ModalTransition";
import MasterItemForm from "@/components/forms/MasterItemForm";
import type { FormSlugType } from "@/types/global";
import type { IJwtDecode } from "@/types/session";
import type { IItem } from "@/types/prisma-api/item";

const sortDefault: GridSortModel = [
  { field: "masteritem_description", sort: "asc" },
];

const title = "Produk";
const path = "items";

const ProductsPage: MyPage = () => {
  const router = useRouter();

  const [rows, setRows] = useState<IItem[]>([]);
  const [countAll, setCountAll] = useState<number>(0);
  const [sortModel, setSortModel] = useState<GridSortModel | undefined>(
    sortDefault,
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel | undefined>(
    undefined,
  );
  const [selectionModel, setSelectionModel] = useState<GridInputSelectionModel>(
    [],
  );
  const [dataFilter, setDataFilter] = useState({ sortModel, filterModel });

  // console.log({ filterModel: dataFilter.filterModel });

  const { search } = useAppStore();

  const {
    isError,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
  } = api.item.findAll.useInfiniteQuery(
    {
      limit: 150,
      search,
      filter: dataFilter.filterModel,
      // filter: JSON.stringify(dataFilter),
    },
    {
      getNextPageParam: (lastPage: PaginationResponse<IItem>) =>
        typeof lastPage.currentPage === "number" && rows.length < countAll
          ? (lastPage.currentPage ?? 0) + 1
          : undefined,
    },
  );

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Kode",
      flex: 1,
      renderCell: (params: GridRenderCellParams<unknown, IItem, unknown>) => {
        const display = params.row.code;
        return (
          <Link
            href={{
              pathname: "/masters/products",
              query: { slug: ["v", params.row.id] },
            }}
            as={`/masters/products/v/${params.row.id}`}
          >
            <MuiLink component="button">{display}</MuiLink>
          </Link>
        );
      },
    },
    {
      field: "name",
      headerName: "Nama",
      type: "string",
      flex: 1,
    },
    {
      field: "itemCategory.name",
      headerName: "Kategori",
      type: "string",
      flex: 1,
      valueGetter: (params: GridValueGetterParams<unknown, IItem>) => {
        return params.row.itemCategory?.name ?? "-";
      },
    },
    /* {
      field: "masterother_description_unit",
      headerName: "Unit",
      flex: 1,
      type: "string",
      valueGetter: (params: GridValueGetterParams<unknown, IItem>) => {
        return params.row.item_uom?.masterother_description;
      },
    }, */
    {
      field: "tax.name",
      headerName: "Pajak",
      flex: 1,
      type: "string",
      valueGetter: (params: GridValueGetterParams<unknown, IItem>) => {
        return params.row.tax?.name;
      },
    },
    {
      field: "isActive",
      headerName: "Aktif",
      type: "boolean",
      filterable: false,
      flex: 1,
      renderCell: (params: GridRenderCellParams<unknown, IItem, unknown>) => (
        <Chip
          icon={params.row.isActive ? <Done /> : <Close />}
          label={params.row.isActive ? "Aktif" : "Non-Aktif"}
          color={params.row.isActive ? "primary" : "secondary"}
        />
      ),
    },
    {
      field: "createdBy",
      headerName: "Dibuat Oleh",
      type: "string",
      flex: 1,
      hide: true,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      renderCell: (params: GridRenderCellParams<unknown, IItem, unknown>) => {
        const id = params.row.id;
        return (
          <CustomMenu
            id={id}
            menus={[
              {
                icon: <EditIcon />,
                label: "Edit",
                onClick: (params) =>
                  params &&
                  router.push(
                    {
                      pathname: "/masters/products",
                      query: { slug: ["f", params] },
                    },
                    `/masters/products/f/${params}`,
                  ),
              },
              {
                icon: <FileCopyIcon />,
                label: "Duplicate",
                onClick: (params) => console.log(params),
              },
              { label: "divider" },
              {
                icon: <ArchiveIcon />,
                label: "Archive",
                onClick: (params) => console.log(params),
              },
              {
                icon: <MoreHorizIcon />,
                label: "More",
                onClick: (params) => console.log(params),
              },
            ]}
          />
        );
      },
    },
  ];

  const handleSortChange = (params: GridSortModel) => {
    setSortModel(params);
  };

  const handleSelectionChange = (params: GridSelectionModel) => {
    setSelectionModel(params);
  };

  const handleFilterChange = (params: GridFilterModel) => {
    const items = params.items.filter((item) => {
      return item.value !== "" && item.value !== undefined;
    });
    const dataFilterModel = {
      items,
      linkOperator: params.linkOperator,
    };

    if (dataFilterModel.items) {
      if (dataFilterModel.items.length > 0) {
        const newFilter = convertOperator(dataFilterModel);
        setFilterModel({ ...dataFilterModel, items: newFilter });
      } else {
        setFilterModel(undefined);
      }
    }
  };

  useEffect(() => {
    if (data) {
      const dataRows: IItem[] = data?.pages
        .map((page) => page.rows.map((row: IItem) => row))
        .flat();
      const dataCountAll: number = data.pages[0]?.countAll ?? 0;
      setRows(dataRows);
      setCountAll(dataCountAll);
    }
  }, [data]);

  useEffect(() => {
    setDataFilter({
      sortModel,
      filterModel,
    });
  }, [sortModel, filterModel]);

  if (isError) return <div>Error! {JSON.stringify(error)}</div>;

  return (
    <>
      <Head>
        <title>{`Gogabook | ${title}`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box className="flex flex-col gap-2">
        <NavTabs data={productTabs} />
        <Box
          component={Paper}
          elevation={4}
          className="relative w-full flex-grow p-4"
        >
          <Box className="mb-2 flex flex-col items-center md:flex-row md:justify-between">
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <div>
              <DeleteMultiple
                route="procedure"
                path={path}
                ids={selectionModel as string[]}
                handleRefresh={() => void refetch()}
              />
              <IconButton onClick={() => void refetch()}>
                <Refresh />
              </IconButton>
              <Link
                href={{
                  pathname: "/masters/products",
                  query: { slug: ["f"] },
                }}
                // href="/masters/products/?slug=['f']"
                as="/masters/products/f"
              >
                <Button variant="contained" endIcon={<Add />}>
                  Create New
                </Button>
              </Link>
            </div>
          </Box>
          <DataGridProAdv
            height="73vh"
            loading={isFetching}
            columns={columns}
            rows={rows}
            rowCount={countAll}
            onRowsScrollEnd={() => hasNextPage && fetchNextPage()}
            filterMode="server"
            sortingMode="server"
            sortModel={sortModel}
            selectionModel={selectionModel}
            onSortModelChange={handleSortChange}
            onFilterModelChange={handleFilterChange}
            onSelectionModelChange={handleSelectionChange}
            checkboxSelection
            disableSelectionOnClick
          />
          {router.query.slug && (
            <ModalTransition
              open
              handleClose={router.back}
              maxWidth="lg"
              fullWidth
            >
              <DialogContent>
                <MasterItemForm slug={router.query.slug as FormSlugType} />
              </DialogContent>
            </ModalTransition>
          )}
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

  return {
    props: {
      session,
    },
  };
};

export default ProductsPage;
ProductsPage.Layout = "Dashboard";
