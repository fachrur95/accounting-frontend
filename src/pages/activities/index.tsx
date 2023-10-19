import DeleteMultiple from "@/components/displays/DeleteMultiple";
import type { MyPage } from "@/components/layouts/layoutTypes";
import DataGridProAdv from "@/components/tables/datagrid/DataGridProAdv";
import { getServerAuthSession } from "@/server/auth";
import type { PaginationResponse } from "@/types/api-response";
import { api } from "@/utils/api";
import { convertOperator } from "@/utils/helpers";
import { useAppStore } from "@/utils/store";
import Refresh from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type {
  GridColDef,
  GridFilterModel,
  GridInputSelectionModel,
  GridSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid-pro";
import jwtDecode from "jwt-decode";
import { type GetServerSideProps } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { IJwtDecode } from "@/types/session";
import type { ILogActivity } from "@/types/prisma-api/log-activity";
import type { WorkerPathType } from "@/types/worker";

const sortDefault: GridSortModel = [{ field: "createdAt", sort: "desc" }];

const title = "Catatan Aktifitas";
const path: WorkerPathType = "transaction";

const pathname = "/activities";

const ActivitiesPage: MyPage = () => {
  const router = useRouter();

  const [rows, setRows] = useState<ILogActivity[]>([]);
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

  const { search } = useAppStore();

  const {
    isError,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
  } = api.logActivity.findAll.useInfiniteQuery(
    {
      limit: 50,
      search,
      filter: filterModel,
      sort: sortModel,
    },
    {
      getNextPageParam: (lastPage: PaginationResponse<ILogActivity>) =>
        typeof lastPage.currentPage === "number" && rows.length < countAll
          ? (lastPage.currentPage ?? 0) + 1
          : undefined,
    },
  );

  const columns: GridColDef[] = [
    {
      field: "createdAt",
      headerName: "Tanggal",
      type: "date",
      flex: 1,
    },
    {
      field: "message",
      headerName: "Aktivitas",
      type: "string",
      flex: 1,
    },
    /* {
      field: "activityType",
      headerName: "Tipe",
      type: "string",
      flex: 1,
    }, */
    {
      field: "createdBy",
      headerName: "Catatan",
      type: "string",
      flex: 1,
    },
    {
      field: "createdBy",
      headerName: "Dilakukan Oleh",
      type: "string",
      flex: 1,
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
      const dataRows: ILogActivity[] = data?.pages
        .map((page) => page.rows.map((row: ILogActivity) => row))
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
                path={path}
                ids={selectionModel as string[]}
                handleRefresh={() => void refetch()}
              />
              <IconButton onClick={() => void refetch()}>
                <Refresh />
              </IconButton>
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
            /* onRowDoubleClick={(params: GridCellParams<unknown, ILogActivity, unknown>) =>
              router.push(
                {
                  pathname,
                  query: { slug: ["f", params.row.id] },
                },
                `${pathname}/f/${params.row.id}`,
              )
            } */
            // checkboxSelection
            disableSelectionOnClick
          />
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

export default ActivitiesPage;
ActivitiesPage.Layout = "Dashboard";
