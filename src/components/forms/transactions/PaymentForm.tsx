import DatePicker from "@/components/controls/DatePicker";
import useNotification from "@/components/hooks/useNotification";
import type { FormSlugType } from "@/types/global";
import type { IPaymentMutation } from "@/types/prisma-api/transaction";
import { api } from "@/utils/api";
import { dateID, formatNumber } from "@/utils/helpers";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
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
  useWatch,
} from "react-hook-form-mui";
import NumericFormatCustom from "../../controls/NumericFormatCustom";
import AutocompleteChartOfAccount from "../../controls/autocompletes/masters/AutocompleteChartOfAccount";
import AutocompletePeople from "../../controls/autocompletes/masters/AutocompletePeople";
import useSessionData from "@/components/hooks/useSessionData";

interface IPaymentForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
  type: "debt" | "receivable";
}

const PaymentForm = (props: IPaymentForm) => {
  const { slug, showIn, type } = props;
  const router = useRouter();
  const { data: sessionData, isFetching: isFetchingSession } = useSessionData();

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

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const { data: dataDraft } = api.payment.draft.useQuery(
    { peopleId: peopleSelected?.id ?? "xx", type },
    {
      enabled: !!peopleSelected && mode === "create",
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: type === "debt" ? "DEBT_PAYMENT" : "RECEIVABLE_PAYMENT",
  });

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
    if (sessionData && mode === "create") {
      const generalSetting = sessionData.session?.unit?.generalSetting;
      if (generalSetting) {
        if (generalSetting.defaultPaymentAccount) {
          setValue("chartOfAccountId", generalSetting.defaultPaymentAccount.id);
          setValue("chartOfAccount", {
            id: generalSetting.defaultPaymentAccount.id,
            label: `${generalSetting.defaultPaymentAccount.code} - ${generalSetting.defaultPaymentAccount.name}`,
          });
        }
      }
    }
  }, [sessionData, mode, setValue]);

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
        open={isFetchingSelected || isFetchingSession}
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
                inputProps={{
                  disabled: mode === "view",
                }}
                slotProps={{
                  openPickerButton: { disabled: mode === "view" },
                }}
              />
              <AutocompleteChartOfAccount
                name="chartOfAccount"
                label="Akun"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
                type="cash-bank"
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
                            width: "25%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          No. Transaksi/ Bukti
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
                            width: "10%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                          align="right"
                        >
                          {`Nilai ${type === "debt" ? "Hutang" : "Piutang"}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "10%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                          align="right"
                        >
                          {`Sisa ${type === "debt" ? "Hutang" : "Piutang"}`}
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Bayar
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "10%",
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
