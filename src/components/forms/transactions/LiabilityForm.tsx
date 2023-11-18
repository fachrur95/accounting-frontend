import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import DatePicker from "@/components/controls/DatePicker";
import TableFooter from "@mui/material/TableFooter";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
  FormContainer,
  TextFieldElement,
  TextareaAutosizeElement,
  useFieldArray,
  useForm,
} from "react-hook-form-mui";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import AutocompletePeople from "../../controls/autocompletes/masters/AutocompletePeople";
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
import type { ILiabilityMutation } from "@/types/prisma-api/transaction";
import type { IPeople } from "@/types/prisma-api/people";
import AutocompleteChartOfAccount from "../../controls/autocompletes/masters/AutocompleteChartOfAccount";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";

interface ILiabilityForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
  type: "revenue" | "expense";
}

const LiabilityForm = (props: ILiabilityForm) => {
  const { slug, showIn, type } = props;
  const router = useRouter();

  const defaultValues: ILiabilityMutation = {
    transactionNumber: "",
    chartOfAccountId: null,
    chartOfAccount: null,
    peopleId: "",
    people: null,
    entryDate: new Date(),
    note: "",
    transactionDetails: [],
  };
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<ILiabilityMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const basePath = `/cash-and-bank/${type}s`;

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

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: type === "revenue" ? "REVENUE" : "EXPENSE",
  });

  const mutationCreate = api.liability.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof ILiabilityMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.liability.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof ILiabilityMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: ILiabilityMutation) => {
    const dataSave = {
      ...data,
      entryDate: new Date(data.entryDate),
      note: data.note === "" || data.note === null ? undefined : data.note,
      chartOfAccountId: data.chartOfAccount?.id ?? "",
      peopleId: data.people?.id ?? undefined,
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
        chartOfAccountId: detail.chartOfAccount?.id ?? "",
        taxId: detail.tax?.id ?? undefined,
        note:
          detail.note === "" || detail.note === null ? undefined : detail.note,
      })),
      type,
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
    if (dataSelected) {
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
          if (key === "entryDate") {
            const entryDate = dataSelected[key]!;
            if (entryDate) {
              setValue("entryDate", new Date(entryDate));
            }
          }
          if (key === "chartOfAccount") {
            const selectedAccount = dataSelected[key]!;
            if (selectedAccount) {
              setValue("chartOfAccount", {
                id: selectedAccount.id,
                label: selectedAccount.name,
              });
            }
            continue;
          }
          if (key === "people") {
            const selectedPeople = dataSelected[key] as IPeople | null;
            if (selectedPeople) {
              setValue("people", {
                id: selectedPeople.id,
                label: selectedPeople.name,
              });
            }
            continue;
          }
          if (key === "transactionDetails") {
            const transactionDetail = dataSelected[key]!;

            if (transactionDetail.length > 0) {
              const dataDetail = transactionDetail.map((row) => {
                const selectedAccount = {
                  id: row.chartOfAccount?.id ?? "",
                  label: row.chartOfAccount?.name ?? "",
                };
                let selectedTax = null;
                if (row.tax) {
                  selectedTax = {
                    id: row.tax.id ?? "",
                    label: row.tax.name ?? "",
                  };
                }
                return {
                  id: row.id,
                  chartOfAccount: selectedAccount,
                  tax: selectedTax,
                  priceInput: row.priceInput,
                  discountInput: row.discountInput,
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

          if (
            key === "transactionNumber" ||
            key === "chartOfAccountId" ||
            key === "peopleId" ||
            key === "note"
          ) {
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
            <Typography variant="h6">
              {type === "revenue" ? "Pendapatan" : "Pengeluaran"}
            </Typography>
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
            <Box
              component={Paper}
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
              <AutocompleteChartOfAccount
                name="chartOfAccount"
                label="Akun"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
              <DatePicker
                label="Tanggal"
                name="entryDate"
                required
                inputProps={{
                  disabled: mode === "view",
                }}
                slotProps={{
                  openPickerButton: { disabled: mode === "view" },
                }}
              />
              <AutocompletePeople
                name="people"
                label={`${
                  type === "revenue" ? "Pelanggan" : "Pemasok"
                } (opsional)`}
                autocompleteProps={{
                  disabled: mode === "view",
                }}
                type={type === "revenue" ? "customer" : "supplier"}
              />
            </Box>
            <div className="overflow-auto">
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
                            width: "50%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Sumber Akun
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "25%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                          align="right"
                        >
                          Nilai
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
                              minWidth: { xs: 100, md: "auto" },
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
                          <TableCell align="right">
                            <AutocompleteChartOfAccount
                              name={`transactionDetails.${index}.chartOfAccount`}
                              required
                              autocompleteProps={{
                                size: "small",
                                disabled: mode === "view",
                              }}
                              textFieldProps={{
                                hiddenLabel: true,
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
                    {mode !== "view" && (
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={6}>
                            <Button
                              startIcon={<Add />}
                              onClick={() =>
                                void append({
                                  chartOfAccountId: "",
                                  chartOfAccount: null,
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
                      </TableFooter>
                    )}
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

export default LiabilityForm;
