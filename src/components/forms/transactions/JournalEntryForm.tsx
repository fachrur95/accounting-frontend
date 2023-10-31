import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DatePicker from "@/components/controls/DatePicker";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
  FormContainer,
  TextFieldElement,
  TextareaAutosizeElement,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form-mui";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import NumericFormatCustom from "../../controls/NumericFormatCustom";
import { api } from "@/utils/api";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { FormSlugType } from "@/types/global";
import type { IJournalEntryMutation } from "@/types/prisma-api/transaction";
import AutocompleteChartOfAccount from "../../controls/autocompletes/masters/AutocompleteChartOfAccount";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import { formatCurrency } from "@/utils/helpers";
import useNotification from "@/components/hooks/useNotification";

interface IJournalEntryForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

type TTotalDebitCredit = { debit: number; credit: number };

const basePath = `/other-transactions/journal-entries`;

const JournalEntryForm = (props: IJournalEntryForm) => {
  const { slug, showIn } = props;
  const router = useRouter();

  const defaultValues: IJournalEntryMutation = {
    transactionNumber: "",
    entryDate: new Date(),
    note: "",
    transactionDetails: [],
  };
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [total, setTotal] = useState<TTotalDebitCredit>({
    debit: 0,
    credit: 0,
  });
  const formContext = useForm<IJournalEntryMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactionDetails",
  });

  const transactionDetails = useWatch({ control, name: "transactionDetails" });

  /* console.log({
    test,
    getValues: getValues(`transactionDetails[0]?.chartOfAccount?.name`),
    watch: watch(`transactionDetails[0]?.chartOfAccount?.name`),
  }); */

  // const defaultUnit = watch("transactionDetails");
  // const selectedCategory = watch("itemCategory");
  // const currentVariantCategory = watch("variantCategories");
  // const currentVariants = watch("variants");

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: selectedId ?? "" },
      { enabled: !!selectedId, refetchOnWindowFocus: false },
    );

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: "JOURNAL_ENTRY",
  });

  // console.log({ dataNumber });

  const mutationCreate = api.journalEntry.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IJournalEntryMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.journalEntry.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IJournalEntryMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IJournalEntryMutation) => {
    const dataSave: IJournalEntryMutation = {
      ...data,
      entryDate: new Date(data.entryDate),
      note: data.note === "" || data.note === null ? undefined : data.note,
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
        chartOfAccountId: detail.chartOfAccount?.id ?? "",
        note:
          detail.note === "" || detail.note === null ? undefined : detail.note,
      })),
    };
    console.log({ dataSave });
    if (selectedId) {
      return void mutationUpdate.mutate({ ...dataSave, id: selectedId });
    }
    return void mutationCreate.mutate(dataSave);
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

  useEffect(() => {
    if (dataNumber && mode === "create") {
      setValue("transactionNumber", dataNumber.transactionNumber);
    }
  }, [dataNumber, mode, setValue]);

  useEffect(() => {
    if (transactionDetails) {
      const sumTotal = transactionDetails.reduce<TTotalDebitCredit>(
        (obj, detail) => {
          obj.debit += detail.debit;
          obj.credit += detail.credit;
          return obj;
        },
        { debit: 0, credit: 0 },
      );
      setTotal(sumTotal);
    }
  }, [transactionDetails]);

  useEffect(() => {
    if (dataSelected) {
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
          if (key === "entryDate") {
            const entryDate = dataSelected[key]!;
            if (entryDate) {
              setValue("entryDate", new Date(entryDate));
            }
          }
          if (key === "transactionDetails") {
            const transactionDetail = dataSelected[key]!;

            if (transactionDetail.length > 0) {
              const dataDetail = transactionDetail.map((row) => {
                const selectedAccount = {
                  id: row.chartOfAccount?.id ?? "",
                  label: row.chartOfAccount?.name ?? "",
                };
                return {
                  id: row.id,
                  chartOfAccount: selectedAccount,
                  debit: row.vector === "POSITIVE" ? row.priceInput : 0,
                  credit: row.vector === "NEGATIVE" ? row.priceInput : 0,
                  note: row.note,
                };
              });
              setValue("transactionDetails", dataDetail);
            }

            continue;
          }
          if (key === "files") {
            continue;
          }
          // "itemCategory" | "transactionDetails" | "tax" | "files" | "id"

          if (key === "transactionNumber" || key === "note") {
            setValue(key, dataSelected[key]);
          }
        }
      }
    }
  }, [dataSelected, setValue]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetchingSelected}
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
            <Typography variant="h6">Jurnal Umum</Typography>
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
                // type="submit"
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
            <Box
              component={Paper}
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextFieldElement
                name="transactionNumber"
                label="No. Transaksi"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
              />
              <DatePicker
                label="Tanggal"
                name="entryDate"
                required
                disabled={mode === "view"}
              />
            </Box>
            <div className="overflow-auto">
              <Box component={Paper} className="table w-full table-fixed">
                <TableContainer
                  component={Paper}
                  elevation={0}
                  variant="outlined"
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell width="5%" align="right">
                          No
                        </TableCell>
                        <TableCell width="40%">Akun</TableCell>
                        <TableCell width="20%" align="right">
                          Debit
                        </TableCell>
                        <TableCell width="20%" align="right">
                          Kredit
                        </TableCell>
                        <TableCell width="10%">Catatan</TableCell>
                        {mode !== "view" && (
                          <TableCell width="5%" align="center">
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
                          <TableCell align="right">
                            <AutocompleteChartOfAccount
                              name={`transactionDetails.${index}.chartOfAccount`}
                              required
                              autocompleteProps={{
                                size: "small",
                                disabled: mode === "view",
                                /* onChange: (_, data) => {
                                  if (index === 0) {
                                    setDefaultUnit(
                                      (data as IDataOption | null)?.label ??
                                        null,
                                    );
                                  }
                                }, */
                              }}
                              textFieldProps={{
                                hiddenLabel: true,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextFieldElement
                              name={`transactionDetails.${index}.debit`}
                              hiddenLabel
                              InputProps={{
                                inputComponent: NumericFormatCustom as never,
                                disabled: mode === "view",
                                onBlur: (event) => {
                                  if (parseFloat(event.target.value) > 0) {
                                    setValue(
                                      `transactionDetails.${index}.credit`,
                                      0,
                                    );
                                  }
                                },
                              }}
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <TextFieldElement
                              name={`transactionDetails.${index}.credit`}
                              hiddenLabel
                              InputProps={{
                                inputComponent: NumericFormatCustom as never,
                                disabled: mode === "view",
                                onBlur: (event) => {
                                  if (parseFloat(event.target.value) > 0) {
                                    setValue(
                                      `transactionDetails.${index}.debit`,
                                      0,
                                    );
                                  }
                                },
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
                                  chartOfAccountId: "",
                                  chartOfAccount: null,
                                  debit: 0,
                                  credit: 0,
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
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography variant="body1">Total</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            {formatCurrency(total.debit)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1">
                            {formatCurrency(total.credit)}
                          </Typography>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </TableContainer>
              </Box>
            </div>
            <Box
              component={Paper}
              variant="outlined"
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

export default JournalEntryForm;
