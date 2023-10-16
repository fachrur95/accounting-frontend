import SearchInput from "@/components/controls/SearchInput";
import ConfirmationDialog from "@/components/dialogs/ConfirmationDialog";
import ModalTransition from "@/components/dialogs/ModalTransition";
import InstituteForm from "@/components/forms/InstituteForm";
import useNotification from "@/components/hooks/useNotification";
import type { MyPage } from "@/components/layouts/layoutTypes";
import { getServerAuthSession } from "@/server/auth";
import type { PaginationResponse } from "@/types/api-response";
import type { FormSlugType } from "@/types/global";
import type { IInstitute } from "@/types/prisma-api/institute";
import { api } from "@/utils/api";
import { useAppStore } from "@/utils/store";
import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { type GetServerSideProps } from "next";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

const pathname = "/credentials/institute";

const InstituteCredentialPage: MyPage = () => {
  const router = useRouter();
  const { ref, inView } = useInView();
  const { search } = useAppStore();
  const { data: session, update: updateSession } = useSession();
  const [rows, setRows] = useState<IInstitute[]>([]);
  const [countAll, setCountAll] = useState<number>(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { setOpenNotification } = useNotification();

  const { data, fetchNextPage, hasNextPage, refetch } =
    api.instituteCredentials.getAll.useInfiniteQuery(
      { limit: 10, search },
      {
        getNextPageParam: (lastPage: PaginationResponse<IInstitute>) =>
          typeof lastPage.currentPage === "number" && rows.length < countAll
            ? (lastPage.currentPage ?? 0) + 1
            : undefined,
      },
    );

  const mutation = api.instituteCredentials.set.useMutation();

  const mutationDelete = api.instituteCredentials.destroy.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  const handleDelete = (): void => {
    if (!selectedId) return;

    mutationDelete.mutate({ id: selectedId });
    setSelectedId(null);
  };

  const handleSetInstitute = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    /* console.log({
      typeof: typeof (event.target as HTMLElement).classList,
      check: (event.target as HTMLElement).classList,
    });
    if ((event.target as HTMLElement).classList.contains("MuiSvgIcon-root")) {
      return;
    } */

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
          void router.push("/credentials/unit");
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
      const dataRows: IInstitute[] = data?.pages
        .map((page) => page.rows.map((row: IInstitute) => row))
        .flat();
      const dataCountAll: number = data.pages[0]?.countAll ?? 0;
      setRows(dataRows);
      setCountAll(dataCountAll);
    }
  }, [data]);

  useEffect(() => {
    void refetch();
  }, [router.query.slug, refetch]);

  return (
    <React.Fragment>
      <Head>
        <title>{`Bidang Usaha | Pilih Lembaga`}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Container maxWidth="md" component={Paper} sx={{ py: 3, my: 2 }}>
        <Box>
          <Button
            variant="text"
            color="error"
            startIcon={<ArrowBackIos />}
            onClick={() => void signOut()}
          >
            Keluar
          </Button>
        </Box>
        <Box className="flex flex-row items-center justify-between py-2">
          <div>
            <Typography variant="h4">Lembaga</Typography>
            <Typography variant="body1">{rows.length} Lembaga</Typography>
          </div>
          <div>
            <Typography variant="h5">Masuk sebagai</Typography>
            <Typography variant="body1">
              {session?.user.email ?? "-"}
            </Typography>
          </div>
        </Box>
        <Box className="flex flex-row items-center justify-between py-2">
          <div>
            <SearchInput />
          </div>
          <Link
            href={{
              pathname,
              query: { slug: ["f"] },
            }}
            as={`${pathname}/f`}
          >
            <Button
              variant="contained"
              color="success"
              startIcon={<Add />}
              // onClick={() => setOpenAddNew(true)}
              // onClick={() => void handleUpdateSession()}
            >
              Tambah
            </Button>
          </Link>
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
                <TableCell>Lembaga</TableCell>
                <TableCell align="center" width="10%">
                  Opsi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  onClick={(event) => void handleSetInstitute(event, row.id)}
                  className="cursor-pointer"
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                    {index === rows.length - 1 && (
                      <div className="invisible" ref={ref}></div>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={(event) => {
                        event.stopPropagation();

                        void router.push(
                          {
                            pathname,
                            query: { slug: ["f", row.id] },
                          },
                          `${pathname}/f/${row.id}`,
                        );
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {router.query.slug && (
          <ModalTransition
            open
            handleClose={router.back}
            maxWidth="sm"
            fullWidth
            scroll="paper"
          >
            <InstituteForm
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
      </Container>
    </React.Fragment>
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

  return {
    props: {
      session,
    },
  };
};

export default InstituteCredentialPage;
InstituteCredentialPage.Layout = "Image";
