import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import DatePicker from "@/components/controls/DatePicker";
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
import { dateID, formatNumber } from "@/utils/helpers";
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
import type { IPaymentMutation } from "@/types/prisma-api/transaction";
import AutocompleteChartOfAccount from "../../controls/autocompletes/masters/AutocompleteChartOfAccount";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";

interface IPaymentForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
  type: "debt" | "receivable";
}

const PaymentForm = (props: IPaymentForm) => {
  const { slug, showIn, type } = props;
  const router = useRouter();

  const defaultValues: IPaymentMutation = {
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
  const formContext = useForm<IPaymentMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const basePath = `/cash-and-bank/${
    type === "debt" ? "payable" : type
  }-payments`;

  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { fields, remove } = useFieldArray({
    control,
    name: "transactionDetails",
  });

  const peopleSelected = useWatch({ control, name: "people" });
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

  const { data: dataDraft } = api.payment.draft.useQuery(
    { peopleId: peopleSelected?.id ?? "xx", type },
    {
      enabled: !!peopleSelected && mode === "create",
      refetchOnWindowFocus: false,
    },
  );

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: type === "debt" ? "DEBT_PAYMENT" : "RECEIVABLE_PAYMENT",
  });

  // console.log({ dataNumber });

  const mutationCreate = api.payment.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IPaymentMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.payment.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IPaymentMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IPaymentMutation) => {
    const dataSave = {
      ...data,
      entryDate: new Date(data.entryDate),
      note: data.note === "" || data.note === null ? undefined : data.note,
      chartOfAccountId: data.chartOfAccount?.id ?? "",
      peopleId: data.people?.id ?? "",
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
        transactionPaymentId: detail.transactionPaymentId ?? "",
        note:
          detail.note === "" || detail.note === null ? undefined : detail.note,
      })),
    };
    console.log({ dataSave });
    if (selectedId) {
      return void mutationUpdate.mutate({ ...dataSave, type, id: selectedId });
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

  useEffect(() => {
    if (dataNumber && mode === "create") {
      setValue("transactionNumber", dataNumber.transactionNumber);
    }
  }, [dataNumber, mode, setValue]);

  useEffect(() => {
    if (dataDraft && mode === "create") {
      const drafts = dataDraft.map((draft) => ({
        transactionPaymentId: draft.id,
        transactionPaymentNumber: draft.transactionNumber,
        entryDate: draft.entryDate,
        dueDate: draft.dueDate,
        underPayment: draft.underPayment,
        remainingPayment: draft.remainingPayment,
        priceInput: 0,
        note: "",
      }));
      setValue("transactionDetails", drafts);
    }
  }, [dataDraft, mode, setValue]);

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
            const selectedPeople = dataSelected[key]!;
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
                return {
                  id: row.id,
                  transactionPaymentId: row.transactionPaymentId,
                  transactionPaymentNumber:
                    row.transactionPayment?.transactionNumber,
                  entryDate: new Date(
                    row.transactionPayment?.entryDate ?? new Date(),
                  ),
                  dueDate: new Date(
                    row.transactionPayment?.dueDate ?? new Date(),
                  ),
                  underPayment: row.transactionPayment?.underPayment ?? 0,
                  remainingPayment:
                    (row.transactionPayment?.underPayment ?? 0) -
                    (row.transactionPayment?.transactionDetailPayments?.reduce(
                      (sum, opt) => sum + opt.priceInput,
                      0,
                    ) ?? 0) +
                    (row.priceInput ?? 0),
                  priceInput: row.priceInput,
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
              {type === "debt" ? "Pembayaran Hutang" : "Penerimaan Piutang"}
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
              <AutocompletePeople
                name="people"
                label={`${type === "debt" ? "Pemasok" : "Pelanggan"}`}
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
                type={type === "debt" ? "supplier" : "customer"}
              />
              <DatePicker
                label="Tanggal"
                name="entryDate"
                required
                disabled={mode === "view"}
              />
              <AutocompleteChartOfAccount
                name="chartOfAccount"
                label="Akun"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
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
                        <TableCell width="25%">No. Transaksi/ Bukti</TableCell>
                        <TableCell width="20%">Tanggal</TableCell>
                        <TableCell width="10%" align="right">
                          {`Nilai ${type === "debt" ? "Hutang" : "Piutang"}`}
                        </TableCell>
                        <TableCell width="10%" align="right">
                          {`Sisa ${type === "debt" ? "Hutang" : "Piutang"}`}
                        </TableCell>
                        <TableCell width="15%">Bayar</TableCell>
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
                          <TableCell>
                            {row.transactionPaymentNumber ?? "-"}
                          </TableCell>
                          <TableCell>
                            {dateID(new Date(row.entryDate))}
                          </TableCell>
                          <TableCell align="right">
                            {formatNumber(row.underPayment ?? 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatNumber(row.remainingPayment ?? 0)}
                          </TableCell>
                          <TableCell align="right">
                            <TextFieldElement
                              name={`transactionDetails.${index}.priceInput`}
                              hiddenLabel
                              InputProps={{
                                inputComponent: NumericFormatCustom as never,
                                disabled: mode === "view",
                                inputProps: {
                                  isAllowed: (values: {
                                    floatValue: number;
                                  }) => {
                                    const { floatValue } = values;
                                    return (
                                      (floatValue ?? 0) <=
                                      (row.remainingPayment ?? 0)
                                    );
                                  },
                                },
                              }}
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <TextFieldElement
                              name={`transactionDetails.${index}.note`}
                              hiddenLabel
                              InputProps={{
                                disabled: mode === "view",
                              }}
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
              <Box className="grid w-full gap-2 md:col-start-3">
                <Box className="grid-child grid grid-cols-2 items-end justify-center">
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1" align="right">
                    {formatNumber(
                      transactionDetails?.reduce(
                        (sum, detail) => sum + detail.priceInput,
                        0,
                      ),
                    ) ?? 0}
                  </Typography>
                </Box>
              </Box>
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

export default PaymentForm;
