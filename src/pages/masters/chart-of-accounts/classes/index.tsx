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
// import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
// import Button from "@mui/material/Button";
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
} from "@mui/x-data-grid-pro";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import Head from "next/head";
// import Link from "next/link";
import { useEffect, useState } from "react";
import CustomMenu from "@/components/displays/StyledMenu";
import NavTabs from "@/components/tabs";
import { chartOfAccountTabs } from "@/components/tabs/data";
import { useRouter } from "next/router";
import ModalTransition from "@/components/dialogs/ModalTransition";
// import MasterAccountClassForm from "@/components/forms/MasterAccountClassForm";
import type { FormSlugType } from "@/types/global";
import type { IJwtDecode } from "@/types/session";
import type { IAccountClass } from "@/types/prisma-api/account-class";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import type { WorkerPathType } from "@/types/worker";
import dynamic from "next/dynamic";
import { Role } from "@/types/prisma-api/role.d";

const MasterAccountClassForm = dynamic(
  () => import("@/components/forms/MasterAccountClassForm"),
);

const sortDefault: GridSortModel = [{ field: "code", sort: "asc" }];

const title = "Akun Utama";
const path: WorkerPathType = "account-class";

const pathname = "/masters/chart-of-accounts/classes";

const AccountClassesPage: MyPage = () => {
  const router = useRouter();

  const [rows, setRows] = useState<IAccountClass[]>([]);
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
  } = api.accountClass.findAll.useInfiniteQuery(
    {
      limit: 50,
      search,
      filter: filterModel,
      sort: sortModel,
    },
    {
      getNextPageParam: (lastPage: PaginationResponse<IAccountClass>) =>
        typeof lastPage.currentPage === "number" && rows.length < countAll
          ? (lastPage.currentPage ?? 0) + 1
          : undefined,
    },
  );

  const mutationDelete = api.accountClass.destroy.useMutation({
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
      field: "code",
      headerName: "Kode",
      type: "string",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Nama",
      type: "string",
      flex: 1,
    },
    {
      field: "group",
      headerName: "Label",
      type: "string",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Posisi Akun",
      type: "string",
      flex: 1,
    },
    {
      field: "balanceSheetPosition",
      headerName: "Posisi dalam Neraca",
      type: "string",
      flex: 1,
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
      renderCell: (
        params: GridRenderCellParams<unknown, IAccountClass, unknown>,
      ) => {
        const id = params.row.id;
        return (
          <CustomMenu
            id={id}
            menus={[
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
              },
              {
                icon: <DeleteForever />,
                label: "Hapus",
                onClick: (params) => params && setSelectedId(params),
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
      const dataRows: IAccountClass[] = data?.pages
        .map((page) => page.rows.map((row: IAccountClass) => row))
        .flat();
      const dataCountAll: number = data.pages[0]?.countAll ?? 0;
      setRows(dataRows);
      setCountAll(dataCountAll);
    }
  }, [data]);

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
        <NavTabs data={chartOfAccountTabs} />
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
              {/* <Link
                href={{
                  pathname,
                  query: { slug: ["f"] },
                }}
                as={`${pathname}/f`}
              >
                <Button variant="contained" endIcon={<Add />}>
                  Tambah
                </Button>
              </Link> */}
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
            onRowDoubleClick={(params) =>
              router.push(
                {
                  pathname,
                  query: { slug: ["v", params.row.id] },
                },
                `${pathname}/v/${params.row.id}`,
              )
            }
            // checkboxSelection
            disableSelectionOnClick
          />
          {router.query.slug && (
            <ModalTransition
              open
              handleClose={router.back}
              maxWidth="lg"
              fullWidth
              scroll="paper"
            >
              <MasterAccountClassForm
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

export default AccountClassesPage;
AccountClassesPage.Layout = "Dashboard";
