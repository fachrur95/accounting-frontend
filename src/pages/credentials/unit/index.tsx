import useNotification from "@/components/hooks/useNotification";
import type { MyPage } from "@/components/layouts/layoutTypes";
import type { PaginationResponse } from "@/types/api-response";
import type { IUnit } from "@/types/prisma-api/unit";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Head from "next/head";
import { useAppStore } from "@/utils/store";
import SearchInput from "@/components/controls/SearchInput";

const UnitCredentialPage: MyPage = () => {
  const router = useRouter();
  const { ref, inView } = useInView();
  const { search } = useAppStore();
  const { data: session, update: updateSession } = useSession();
  const [rows, setRows] = useState<IUnit[]>([]);
  const [countAll, setCountAll] = useState<number>(0);
  const { setOpenNotification } = useNotification();

  const { data, fetchNextPage, hasNextPage } =
    api.unitCredentials.getAll.useInfiniteQuery(
      { limit: 10, search },
      {
        getNextPageParam: (lastPage: PaginationResponse<IUnit>) =>
          typeof lastPage.currentPage === "number" && rows.length < countAll
            ? (lastPage.currentPage ?? 0) + 1
            : undefined,
      },
    );

  const mutation = api.unitCredentials.set.useMutation();

  const handleSetUnit = async (id: string) => {
    console.log({ id });
    await mutation.mutateAsync(
      { id },
      {
        onError: (err) => console.log(err),
        onSuccess: async (data) => {
          // console.log(data);
          if (!data) {
            return void setOpenNotification("Error to set business");
          }
          await handleUpdateSession({
            accessToken: data.access.token,
            refreshToken: data.refresh.token,
          });
          void router.push("/");
        },
      },
    );
  };

  const handleUpdateSession = async (params: {
    accessToken: string;
    refreshToken: string;
  }) => {
    await updateSession({
      ...session,
      ...params,
    });
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const dataRows: IUnit[] = data?.pages
        .map((page) => page.rows.map((row: IUnit) => row))
        .flat();
      const dataCountAll: number = data.pages[0]?.countAll ?? 0;
      setRows(dataRows);
      setCountAll(dataCountAll);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Head>
        <title>{`Bidang Usaha | Pilih Unit`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container maxWidth="md" component={Paper} sx={{ py: 3, my: 2 }}>
        <Box>
          <Button
            variant="text"
            color="success"
            startIcon={<ArrowBackIos />}
            onClick={() => void router.push("/credentials/institute")}
          >
            Kembali Ke Lembaga
          </Button>
        </Box>
        <Box className="flex flex-row items-center justify-between py-2">
          <div>
            <Typography variant="h4">Unit</Typography>
            <Typography variant="body1">{rows.length} Unit</Typography>
          </div>
          <div>
            <Typography variant="h5">Masuk sebagai</Typography>
            <Typography variant="body1">
              {session?.user.email ?? "-"}
            </Typography>
            {/* <Typography variant="subtitle2">
              {sessionData.businessDesc ?? "-"}
            </Typography> */}
          </div>
        </Box>
        <Box className="flex flex-row items-center justify-between py-2">
          <div>
            <SearchInput />
          </div>
        </Box>
        <TableContainer
          component={Paper}
          variant="outlined"
          elevation={0}
          sx={{ maxHeight: "60vh" }}
        >
          <Table stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell>Unit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  onClick={() => void handleSetUnit(row.id ?? "")}
                  className="cursor-pointer"
                >
                  <TableCell component="th" scope="row">
                    {row.name ?? ""}
                    {index === rows.length - 1 && (
                      <div className="invisible" ref={ref}></div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </React.Fragment>
  );
};

export default UnitCredentialPage;
UnitCredentialPage.Layout = "Image";
