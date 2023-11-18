import DatePicker from "@/components/controls/DatePicker";
import useNotification from "@/components/hooks/useNotification";
import type { FormSlugType } from "@/types/global";
import type { IBeginBalanceDebtReceivableMutation } from "@/types/prisma-api/transaction";
import { api } from "@/utils/api";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FormContainer,
  TextFieldElement,
  TextareaAutosizeElement,
  useFieldArray,
  useForm,
} from "react-hook-form-mui";
import NumericFormatCustom from "../../controls/NumericFormatCustom";
import AutocompleteChartOfAccount from "../../controls/autocompletes/masters/AutocompleteChartOfAccount";
import AutocompletePeople from "../../controls/autocompletes/masters/AutocompletePeople";

interface IBeginBalanceDebtReceivableForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
  type: "debt" | "receivable";
}

const defaultValues: IBeginBalanceDebtReceivableMutation = {
  entryDate: new Date(),
  chartOfAccountId: "",
  chartOfAccount: null,
  transactionDetails: [],
};

const BeginningBalanceDebtReceivableForm = (
  props: IBeginBalanceDebtReceivableForm,
) => {
  const { slug, showIn, type } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<IBeginBalanceDebtReceivableMutation>({
    defaultValues,
  });
  const { setOpenNotification } = useNotification();

  const basePath = `/other-transactions/beginning-balances/${type}s`;

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactionDetails",
  });

  const mutationCreate = api.beginBalanceDebtReceivable.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IBeginBalanceDebtReceivableMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.beginBalanceDebtReceivable.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IBeginBalanceDebtReceivableMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IBeginBalanceDebtReceivableMutation) => {
    const dataSave = {
      ...data,
      chartOfAccountId: data.chartOfAccount?.id ?? "",
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
        peopleId: detail.people?.id ?? "",
        note:
          detail.note === "" || detail.note === null ? undefined : detail.note,
      })),
    };
    console.log({ dataSave });
    if (selectedId) {
      return void mutationUpdate.mutate({ ...dataSave, id: selectedId, type });
    }
    return void mutationCreate.mutate({ ...dataSave, type });
  };

  useEffect(() => {
    const [path, id] = slug;
    if ((path === "f" || path === "v") && typeof id === "string") {
      setSelectedId(id);
    }
    if (path === "f" && typeof id === "string") {
      setMode("update");
    }
    if (path === "v" && typeof id === "string") {
      setMode("view");
    }
    if (path !== "f" && path !== "v") {
      setMode("create");
    }
  }, [slug]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isSubmitting}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* component={showIn === "page" ? Paper : undefined} */}
      <DialogTitle>
        <Box
          component={showIn === "page" ? Paper : undefined}
          className={`flex items-center justify-between ${
            showIn === "page" ? "px-4 py-2" : ""
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <Link href={basePath}>
              <IconButton color="error">
                <Close />
              </IconButton>
            </Link>
            <Typography variant="h6">{`Saldo Awal ${
              type === "debt" ? "Hutang" : "Piutang"
            }`}</Typography>
          </div>
          <div>
            {mode === "view" && selectedId ? (
              <Button
                variant="contained"
                type="button"
                size="large"
                fullWidth
                startIcon={<Edit />}
                onClick={() => router.push(`${basePath}/f/${selectedId}`)}
              >
                Sunting
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                size="large"
                disabled={isSubmitting}
                fullWidth
                startIcon={<Save />}
                onClick={() => handleSubmit(onSubmit)()}
              >
                Simpan
              </Button>
            )}
          </div>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
          <div className="grid gap-4">
            <Box component={Paper}>
              <Alert severity="info">
                <AlertTitle>Informasi</AlertTitle>
                {`Transaksi ini akan dibuat secara terpisah sesuai dengan ${
                  type === "debt" ? '"pemasok"' : '"pelanggan"'
                } yang telah dipilih agar dapat dibayar secara terpisah di ${
                  type === "debt"
                    ? '"pembayaran hutang"'
                    : '"penerimaan piutang"'
                }`}
              </Alert>
            </Box>
            <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <AutocompleteChartOfAccount
                name="chartOfAccount"
                label="Akun"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
            </Box>
            {/* <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-5"
            >*/}
            <div className="flex flex-col gap-2 overflow-auto">
              <Box component={Paper} className="table w-full table-fixed">
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ maxHeight: 440 }}
                >
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ width: "5%", minWidth: { xs: 80, md: "auto" } }}
                          align="right"
                        >
                          No
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "35%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          {type === "debt" ? "Pemasok" : "Pelanggan"}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "20%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Tanggal
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "20%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                          align="right"
                        >
                          {type === "debt" ? "Total Hutang" : "Total Piutang"}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Catatan
                        </TableCell>
                        {mode !== "view" && (
                          <TableCell
                            sx={{
                              width: "5%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                            align="center"
                          >
                            <Delete />
                          </TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields.map((row, index) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row" align="right">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <AutocompletePeople
                              name={`transactionDetails.${index}.people`}
                              required
                              autocompleteProps={{
                                size: "small",
                                disabled: mode === "view",
                              }}
                              textFieldProps={{
                                hiddenLabel: true,
                              }}
                              type={type === "debt" ? "supplier" : "customer"}
                            />
                          </TableCell>
                          <TableCell>
                            <DatePicker
                              name={`transactionDetails.${index}.entryDate`}
                              required
                              inputProps={{
                                disabled: mode === "view",
                                size: "small",
                              }}
                              slotProps={{
                                openPickerButton: { disabled: mode === "view" },
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextFieldElement
                              name={`transactionDetails.${index}.priceInput`}
                              hiddenLabel
                              InputProps={{
                                inputComponent: NumericFormatCustom as never,
                                disabled: mode === "view",
                              }}
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextFieldElement
                              name={`transactionDetails.${index}.note`}
                              InputProps={{
                                disabled: mode === "view",
                              }}
                              hiddenLabel
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          {mode !== "view" && (
                            <TableCell align="center">
                              <IconButton
                                onClick={() => void remove(index)}
                                color="error"
                                size="small"
                              >
                                <Close />
                              </IconButton>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      {mode !== "view" && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Button
                              startIcon={<Add />}
                              onClick={() =>
                                void append({
                                  peopleId: "",
                                  people: null,
                                  entryDate: new Date(),
                                  priceInput: 0,
                                  note: "",
                                })
                              }
                              size="large"
                              fullWidth
                            >
                              Tambah
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Box>
            </div>
            <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextareaAutosizeElement
                name="note"
                label="Catatan"
                rows={3}
                className="col-start-1"
                disabled={mode === "view"}
              />
            </Box>
            <Button type="submit" disabled={isSubmitting} className="hidden">
              Simpan
            </Button>
          </div>
        </FormContainer>
      </DialogContent>
    </>
  );
};

export default BeginningBalanceDebtReceivableForm;
