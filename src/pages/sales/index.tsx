import DeleteMultiple from "@/components/displays/DeleteMultiple";
import type { MyPage } from "@/components/layouts/layoutTypes";
import DataGridProAdv from "@/components/tables/datagrid/DataGridProAdv";
import { getServerAuthSession } from "@/server/auth";
import type { PaginationResponse } from "@/types/api-response";
import { api } from "@/utils/api";
import { convertOperator, dateConvertID } from "@/utils/helpers";
import { useAppStore } from "@/utils/store";
import Refresh from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import Print from "@mui/icons-material/Print";
import Visibility from "@mui/icons-material/Visibility";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import PointOfSale from "@mui/icons-material/PointOfSale";
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
import { useRouter } from "next/router";
import ModalTransition from "@/components/dialogs/ModalTransition";
// import SalesForm from "@/components/forms/transactions/SalesForm";
import OpenCashRegisterForm from "@/components/forms/OpenCashRegister";
import CloseCashRegisterForm from "@/components/forms/CloseCashRegister";
import type { FormSlugType } from "@/types/global";
import type { IJwtDecode } from "@/types/session";
import type { ITransaction } from "@/types/prisma-api/transaction";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import type { WorkerPathType } from "@/types/worker";
import useSessionData from "@/components/hooks/useSessionData";
import dynamic from "next/dynamic";
import { Role } from "@/types/prisma-api/role.d";
import type { Session } from "next-auth";

const SalesForm = dynamic(
  () => import("@/components/forms/transactions/SalesForm"),
);

const sortDefault: GridSortModel = [{ field: "entryDate", sort: "desc" }];

const title = "Penjualan";
const path: WorkerPathType = "transaction";

const pathname = "/sales";

const SalesPage: MyPage<{ userSession: Session["user"] }> = ({
  userSession,
}) => {
  const router = useRouter();
  const { data: sessionData, refetch: refetchSession } = useSessionData();

  const [rows, setRows] = useState<ITransaction[]>([]);
  const [open, setOpen] = useState<{
    openCashRegister: boolean;
    closeCashRegister: boolean;
  }>({
    openCashRegister: false,
    closeCashRegister: false,
  });
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { search } = useAppStore();

  const {
    isError,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
  } = api.globalTransaction.findAll.useInfiniteQuery(
    {
      limit: 50,
      search,
      filter: filterModel,
      sort: sortModel,
      transactionType: "SALE_INVOICE",
    },
    {
      getNextPageParam: (lastPage: PaginationResponse<ITransaction>) =>
        typeof lastPage.currentPage === "number" && rows.length < countAll
          ? (lastPage.currentPage ?? 0) + 1
          : undefined,
    },
  );

  const mutationDelete = api.globalTransaction.destroy.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleDelete = (): void => {
    if (!selectedId) return;

    mutationDelete.mutate({ id: selectedId });
    setSelectedId(null);
  };

  const columns: GridColDef[] = [
    {
      field: "transactionNumber",
      headerName: "No. Transaksi",
      type: "string",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "people.name",
      headerName: "Pelanggan",
      type: "string",
      flex: 1,
      minWidth: 200,
      valueGetter: (params: GridValueGetterParams<unknown, ITransaction>) => {
        return params.row.people?.name ?? "-";
      },
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "entryDate",
      headerName: "Tanggal",
      type: "date",
      flex: 1,
      minWidth: 200,
      valueGetter: (params: GridValueGetterParams<unknown, ITransaction>) => {
        return dateConvertID(new Date(params.row.entryDate), {
          dateStyle: "long",
          timeStyle: "short",
        });
      },
    },
    {
      field: "note",
      headerName: "Catatan",
      type: "string",
      flex: 1,
      minWidth: 200,
      hide: true,
    },
    {
      field: "createdBy",
      headerName: "Dibuat Oleh",
      type: "string",
      flex: 1,
      minWidth: 200,
      hide: true,
    },
    {
      field: "actions",
      type: "actions",
      width: 80,
      renderCell: (
        params: GridRenderCellParams<unknown, ITransaction, unknown>,
      ) => {
        const id = params.row.id;
        return (
          <CustomMenu
            id={id}
            menus={[
              {
                icon: <Print />,
                label: "Cetak",
                onClick: (params) =>
                  params && router.push(`${pathname}/invoice/${params}`),
              },
              {
                icon: <Visibility />,
                label: "Lihat",
                onClick: (params) =>
                  params &&
                  router.push(
                    {
                      pathname,
                      query: { slug: ["v", params] },
                    },
                    `${pathname}/v/${params}`,
                  ),
              },
              {
                icon: <EditIcon />,
                label: "Sunting",
                onClick: (params) =>
                  params &&
                  router.push(
                    {
                      pathname,
                      query: { slug: ["f", params] },
                    },
                    `${pathname}/f/${params}`,
                  ),
                hidden: userSession.role === Role.USER,
              },
              {
                icon: <DeleteForever />,
                label: "Hapus",
                onClick: (params) => params && setSelectedId(params),
                hidden: userSession.role === Role.USER,
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
      const dataRows: ITransaction[] = data?.pages
        .map((page) => page.rows.map((row: ITransaction) => row))
        .flat();
      const dataCountAll: number = data.pages[0]?.countAll ?? 0;
      setRows(dataRows);
      setCountAll(dataCountAll);
    }
  }, [data]);

  useEffect(() => {
    if (!open.closeCashRegister) {
      void refetchSession();
    }
  }, [refetchSession, open.closeCashRegister]);

  useEffect(() => {
    void refetch();
  }, [router.query.slug, refetch]);

  if (isError) return <div>Error! {JSON.stringify(error)}</div>;

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
            <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
              <DeleteMultiple
                path={path}
                ids={selectionModel as string[]}
                handleRefresh={() => void refetch()}
              />
              <IconButton onClick={() => void refetch()}>
                <Refresh />
              </IconButton>
              {!sessionData?.session?.cashRegister ? (
                <Button
                  variant="contained"
                  startIcon={<PointOfSale />}
                  onClick={() => setOpen({ ...open, openCashRegister: true })}
                >
                  Buka Mesin Kasir
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<PointOfSale />}
                    onClick={() =>
                      setOpen({ ...open, closeCashRegister: true })
                    }
                  >
                    Tutup Mesin Kasir
                  </Button>
                  <Link
                    href={{
                      pathname,
                      query: { slug: ["f"] },
                    }}
                    as={`${pathname}/f`}
                  >
                    <Button variant="contained" endIcon={<Add />}>
                      Tambah
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </Box>
          <DataGridProAdv
            height="79vh"
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
            onRowDoubleClick={(params) =>
              router.push(
                {
                  pathname,
                  query: { slug: ["v", params.row.id] },
                },
                `${pathname}/v/${params.row.id}`,
              )
            }
            /* onRowDoubleClick={(params: GridCellParams<unknown, ITransaction, unknown>) =>
              router.push(
                {
                  pathname,
                  query: { slug: ["f", params.row.id] },
                },
                `${pathname}/f/${params.row.id}`,
              )
            } */
            checkboxSelection={userSession.role !== Role.USER}
            disableSelectionOnClick
          />
          {router.query.slug && (
            <ModalTransition
              open
              handleClose={router.back}
              fullScreen
              scroll="paper"
            >
              <SalesForm
                slug={router.query.slug as FormSlugType}
                showIn="popup"
              />
            </ModalTransition>
          )}
          {typeof selectedId === "string" && (
            <ConfirmationDialog
              open={typeof selectedId === "string"}
              title="Konfirmasi Hapus"
              message="Apakah Anda yakin ingin menghapus ini?"
              onClose={() => setSelectedId(null)}
              onSubmit={handleDelete}
            />
          )}
          {open.openCashRegister && (
            <OpenCashRegisterForm
              open
              setClose={() => setOpen({ ...open, openCashRegister: false })}
            />
          )}
          {open.closeCashRegister && (
            <CloseCashRegisterForm
              open
              setClose={() => setOpen({ ...open, closeCashRegister: false })}
            />
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
      userSession: session.user,
    },
  };
};

export default SalesPage;
SalesPage.Layout = "Dashboard";
