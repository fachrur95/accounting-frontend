import DatePicker from "@/components/controls/DatePicker";
import useNotification from "@/components/hooks/useNotification";
import type { FormSlugType } from "@/types/global";
import type { IDataOption } from "@/types/options";
import type {
  IPurchaseMutation,
  ISalesPurchaseDetailMutation,
} from "@/types/prisma-api/transaction";
import { api } from "@/utils/api";
import { formatNumber } from "@/utils/helpers";
import Add from "@mui/icons-material/Add";
import Keyboard from "@mui/icons-material/Keyboard";
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
import Divider from "@mui/material/Divider";
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
import { useEffect, useRef, useState } from "react";
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
import AutocompleteItem from "../../controls/autocompletes/masters/AutocompleteItem";
import AutocompleteMultipleUom from "../../controls/autocompletes/masters/AutocompleteMultipleUom";
import AutocompletePeople from "../../controls/autocompletes/masters/AutocompletePeople";
import { useHotkeys } from "react-hotkeys-hook";
import useSessionData from "@/components/hooks/useSessionData";

interface IPurchaseForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

type TotalType = {
  subTotal: number;
  total: number;
  totalDiscountDetail: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  balance: number;
};

const basePath = `/purchase`;

const defaultValues: IPurchaseMutation = {
  entryDate: new Date(),
  transactionNumber: "",
  peopleId: "",
  people: null,
  termId: "",
  term: null,
  chartOfAccountId: "",
  chartOfAccount: null,
  paymentInput: 0,
  specialDiscount: 0,
  discountGroupInput: 0,
  note: "",
  transactionDetails: [],
};

const PurchaseForm = (props: IPurchaseForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const { data: sessionData, isFetching: isFetchingSession } = useSessionData();
  const buttonSaveRef = useRef<HTMLButtonElement>(null);
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [total, setTotal] = useState<TotalType>({
    subTotal: 0,
    total: 0,
    totalDiscountDetail: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
    balance: 0,
  });
  const formContext = useForm<IPurchaseMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
    setFocus,
  } = formContext;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactionDetails",
  });

  useHotkeys(
    "alt+n",
    () =>
      mode !== "view" &&
      append({
        itemId: "",
        item: null,
        multipleUomId: "",
        multipleUom: null,
        chartOfAccountId: "",
        chartOfAccount: null,
        qtyInput: 0,
        conversionQty: 0,
        priceInput: 0,
        discountInput: 0,
        note: "",
      }),
    { enableOnFormTags: true },
  );

  useHotkeys("alt+b", () => setFocus("paymentInput"), {
    enableOnFormTags: true,
  });
  useHotkeys("alt+p", () => setFocus("people"), { enableOnFormTags: true });
  useHotkeys("alt+s", () => buttonSaveRef.current.click(), {
    enableOnFormTags: true,
  });

  const transactionDetails: ISalesPurchaseDetailMutation[] = useWatch({
    control,
    name: "transactionDetails",
  });
  const peopleSelected: IDataOption | null = useWatch({
    control,
    name: "people",
  });
  const paymentInput: number = useWatch({ control, name: "paymentInput" });
  const specialDiscount: number =
    useWatch({
      control,
      name: "specialDiscount",
    }) ?? 0;
  const discountGroupInput: number =
    useWatch({
      control,
      name: "discountGroupInput",
    }) ?? 0;

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
    transactionType: "PURCHASE_INVOICE",
  });

  const mutationCreate = api.purchase.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IPurchaseMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.purchase.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IPurchaseMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IPurchaseMutation) => {
    const dataSave = {
      ...data,
      specialDiscount: data.specialDiscount ?? 0,
      discountGroupInput: data.discountGroupInput ?? 0,
      note: data.note === "" || data.note === null ? undefined : data.note,
      chartOfAccountId:
        data.paymentInput > 0
          ? data.chartOfAccount?.id ?? undefined
          : undefined,
      termId: data.term?.id ?? undefined,
      peopleId: data.people?.id ?? "",
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
        conversionQty: detail.multipleUom?.conversionQty ?? 0,
        multipleUomId: detail.multipleUom?.id ?? "",
        chartOfAccountId: detail.chartOfAccount?.id ?? undefined,
        taxId: detail.tax?.id ?? undefined,
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
      const sumTotal = transactionDetails.reduce<
        Omit<TotalType, "grandTotal" | "balance" | "totalDiscount">
      >(
        (obj, detail) => {
          const qty =
            detail.qtyInput * (detail.multipleUom?.conversionQty ?? 0);
          const subTotal = qty * detail.priceInput;
          const total = qty * (detail.priceInput - detail.discountInput);
          const totalDiscountDetail = qty * detail.discountInput;

          obj.subTotal += subTotal;
          obj.totalDiscountDetail += totalDiscountDetail;
          obj.total += total;
          return obj;
        },
        { subTotal: 0, totalDiscountDetail: 0, totalTax: 0, total: 0 },
      );
      const total = sumTotal.total;
      const specialDiscountValue = (specialDiscount / 100) * total;
      const additionalDiscount = discountGroupInput + specialDiscountValue;
      const grandTotal = total - additionalDiscount;
      const balance = grandTotal - paymentInput;
      const totalDiscount = sumTotal.totalDiscountDetail + additionalDiscount;
      setTotal({ ...sumTotal, totalDiscount, grandTotal, balance });
    }
  }, [transactionDetails, paymentInput, specialDiscount, discountGroupInput]);

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
          if (key === "people") {
            const selectedPeople = dataSelected[key]!;
            if (selectedPeople) {
              setValue("people", {
                id: selectedPeople.id,
                label: `${selectedPeople.code} - ${selectedPeople.name}`,
                phone: selectedPeople.phone ?? "-",
                address: selectedPeople.address ?? "-",
              });
            }
            continue;
          }
          if (key === "term") {
            const selectedTerm = dataSelected[key]!;
            if (selectedTerm) {
              setValue("term", {
                id: selectedTerm.id,
                label: selectedTerm.name,
              });
            }
            continue;
          }
          if (key === "chartOfAccount") {
            const selectedChartOfAccount = dataSelected[key]!;
            if (selectedChartOfAccount) {
              setValue("chartOfAccount", {
                id: selectedChartOfAccount.id,
                label: selectedChartOfAccount.name,
              });
            }
            continue;
          }
          if (key === "transactionDetails") {
            const transactionDetail = dataSelected[key]!;

            if (transactionDetail.length > 0) {
              const dataDetail = transactionDetail.map((row) => {
                let selectedItem = null;
                let selectedUnit = null;
                let selectedAccount = null;
                let selectedTax = null;
                if (row.multipleUom) {
                  selectedItem = {
                    id: row.multipleUom.item?.id ?? "",
                    label:
                      `${row.multipleUom.item?.code} - ${row.multipleUom.item?.name}` ??
                      "",
                  };
                  selectedUnit = {
                    id: row.multipleUom.id,
                    label: row.multipleUom.unitOfMeasure?.name ?? "",
                    conversionQty: row.conversionQty ?? 0,
                  };
                }
                if (row.tax) {
                  selectedTax = {
                    id: row.tax.id,
                    label: row.tax.name,
                  };
                }
                if (row.chartOfAccount) {
                  selectedAccount = {
                    id: row.chartOfAccount.id,
                    label: row.chartOfAccount.name,
                  };
                }
                return {
                  id: row.id,
                  item: selectedItem,
                  multipleUom: selectedUnit,
                  chartOfAccount: selectedAccount,
                  tax: selectedTax,
                  qtyInput: row.qtyInput,
                  conversionQty: row.conversionQty,
                  priceInput: row.priceInput,
                  discountInput: row.discountInput,
                  note: row.note,
                };
              });
              setValue("transactionDetails", dataDetail);
            }

            continue;
          }

          if (
            key === "transactionNumber" ||
            key === "peopleId" ||
            key === "termId" ||
            key === "chartOfAccountId" ||
            key === "paymentInput" ||
            key === "specialDiscount" ||
            key === "discountGroupInput" ||
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
            <Typography variant="h6">Pembelian</Typography>
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
                ref={buttonSaveRef}
              >
                Simpan
              </Button>
            )}
          </div>
        </Box>
      </DialogTitle>
      <DialogContent>
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
          <div className="flex flex-col gap-4 md:flex-row">
            <Box className="flex flex-col gap-4 md:min-w-[250px] xl:min-w-[400px]">
              <Box component={Paper} className="flex flex-col gap-4 p-4">
                <Divider textAlign="left">
                  <Typography variant="subtitle2">Informasi Nota</Typography>
                </Divider>
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
                  inputProps={{
                    disabled: true,
                  }}
                  slotProps={{
                    openPickerButton: { disabled: true },
                  }}
                />
              </Box>
              <Box component={Paper} className="flex flex-col gap-4 p-4">
                <Divider textAlign="left">
                  <Typography variant="subtitle2">Informasi Pemasok</Typography>
                </Divider>
                <AutocompletePeople
                  name="people"
                  label="Pemasok (Alt + P)"
                  required
                  autocompleteProps={{
                    disabled: mode === "view",
                    onChange: (_, data) => {
                      if (
                        typeof (data as IDataOption | null)?.inputValue ===
                        "string"
                      ) {
                        setValue("people", null);
                        return window.open(
                          `/masters/contacts/suppliers/f?name=${(
                            data as IDataOption | null
                          )?.inputValue}`,
                          "_ blank",
                        );
                      }
                      if (mode === "create") {
                        setValue(
                          "specialDiscount",
                          (data as IDataOption | null)?.specialDiscount ?? 0,
                        );
                      }
                    },
                  }}
                  type="supplier"
                  addNew
                />
                <Box className="flex flex-col items-start justify-start gap-1 md:flex-row md:items-center">
                  <Typography variant="subtitle2">Telp/ HP:</Typography>
                  <Typography>{peopleSelected?.phone}</Typography>
                </Box>
                <Box className="flex flex-col items-start justify-start gap-1 md:flex-row md:items-center">
                  <Typography variant="subtitle2">Alamat:</Typography>
                  <Typography>{peopleSelected?.address}</Typography>
                </Box>
                {paymentInput > 0 && (
                  <AutocompleteChartOfAccount
                    name="chartOfAccount"
                    label="Akun Pembayaran"
                    autocompleteProps={{
                      disabled: mode === "view",
                    }}
                    type="cash-bank"
                    required={paymentInput > 0}
                  />
                )}
              </Box>
            </Box>
            <Box className="flex flex-col gap-4 md:flex-grow">
              <div className="overflow-auto">
                <Box component={Paper} className="table w-full table-fixed">
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    sx={{ maxHeight: 390 }}
                  >
                    <Table
                      stickyHeader
                      size="small"
                      sx={{ "& .MuiTableCell-root": { px: "6px" } }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{
                              width: "3%",
                              minWidth: { xs: 80, md: "auto" },
                            }}
                            align="right"
                          >
                            No
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "26%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                          >
                            Produk
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "8%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                            align="right"
                          >
                            Qty
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "15%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                            align="right"
                          >
                            Satuan
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "15%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                            align="right"
                          >
                            Harga Satuan
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "10%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                            align="right"
                          >
                            Diskon
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "10%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                            align="right"
                          >
                            Total
                          </TableCell>
                          {/* <TableCell
                          sx={{
                            width: "10%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Catatan
                        </TableCell> */}
                          {mode !== "view" && (
                            <TableCell
                              sx={{
                                width: "3%",
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
                            <TableCell align="right">
                              <AutocompleteItem
                                name={`transactionDetails.${index}.item`}
                                required
                                autocompleteProps={{
                                  size: "small",
                                  disabled: mode === "view",
                                  onChange: (_, data) => {
                                    if (
                                      typeof (data as IDataOption | null)
                                        ?.inputValue === "string"
                                    ) {
                                      setValue(
                                        `transactionDetails.${index}.item`,
                                        null,
                                      );
                                      return window.open(
                                        `/masters/products/f?name=${(
                                          data as IDataOption | null
                                        )?.inputValue}`,
                                        "_ blank",
                                      );
                                    }
                                  },
                                }}
                                textFieldProps={{
                                  hiddenLabel: true,
                                }}
                              />
                              {/* <AutocompleteChartOfAccount
                              name={`transactionDetails.${index}.chartOfAccount`}
                              required
                              autocompleteProps={{
                                size: "small",
                                disabled: mode === "view",
                              }}
                              textFieldProps={{
                                hiddenLabel: true,
                              }}
                            /> */}
                            </TableCell>
                            <TableCell align="right">
                              <TextFieldElement
                                name={`transactionDetails.${index}.qtyInput`}
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
                              <AutocompleteMultipleUom
                                name={`transactionDetails.${index}.multipleUom`}
                                required
                                autocompleteProps={{
                                  size: "small",
                                  disabled: mode === "view",
                                }}
                                textFieldProps={{
                                  hiddenLabel: true,
                                }}
                                itemId={
                                  transactionDetails[index]?.item?.id ?? ""
                                }
                                setDefault={(value) => {
                                  if (!transactionDetails[index]?.multipleUom) {
                                    setValue(
                                      `transactionDetails.${index}.multipleUom`,
                                      value,
                                    );
                                  }
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
                            <TableCell align="right">
                              <TextFieldElement
                                name={`transactionDetails.${index}.discountInput`}
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
                                        (transactionDetails[index]
                                          ?.priceInput ?? 0)
                                      );
                                    },
                                  },
                                }}
                                fullWidth
                                size="small"
                              />
                            </TableCell>
                            <TableCell align="right">
                              {formatNumber(
                                (transactionDetails[index]?.qtyInput ?? 0) *
                                  (transactionDetails[index]?.multipleUom
                                    ?.conversionQty ?? 0) *
                                  ((transactionDetails[index]?.priceInput ??
                                    0) -
                                    (transactionDetails[index]?.discountInput ??
                                      0)),
                              )}
                            </TableCell>
                            {/* <TableCell>
                            <TextFieldElement
                              name={`transactionDetails.${index}.note`}
                              hiddenLabel
                              InputProps={{
                                disabled: mode === "view",
                              }}
                              fullWidth
                              size="small"
                            />
                          </TableCell> */}
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
                            <TableCell colSpan={8}>
                              <Button
                                startIcon={<Add />}
                                onClick={() =>
                                  void append({
                                    itemId: "",
                                    item: null,
                                    multipleUomId: "",
                                    multipleUom: null,
                                    chartOfAccountId: "",
                                    chartOfAccount: null,
                                    qtyInput: 0,
                                    conversionQty: 0,
                                    priceInput: 0,
                                    discountInput: 0,
                                    note: "",
                                  })
                                }
                                size="large"
                                fullWidth
                              >
                                Tambah (Alt + N)
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
                className="grid grid-cols-1 items-start gap-4 p-4 md:grid-cols-3"
              >
                <Box className="flex w-full flex-col items-start gap-4">
                  <TextareaAutosizeElement
                    name="note"
                    label="Catatan"
                    rows={3}
                    className="col-start-1"
                    disabled={mode === "view"}
                    fullWidth
                  />
                  <Box
                    component={Paper}
                    variant="outlined"
                    className="grid w-full grid-cols-1 gap-2 p-2"
                  >
                    <Box className="col-span-1 flex flex-row items-center gap-2">
                      <Keyboard size="small" />
                      <Typography variant="caption">
                        Hot Keys/ Pintasan Keyboard
                      </Typography>
                    </Box>
                    <Typography variant="caption">
                      Alt + B = Fokus ke kolom bayar
                    </Typography>
                    <Typography variant="caption">
                      Alt + N = Tambah baris baru
                    </Typography>
                    <Typography variant="caption">
                      Alt + P = Pilih Pelanggan
                    </Typography>
                    <Typography variant="caption">Alt + S = Simpan</Typography>
                  </Box>
                </Box>
                <Box className="grid w-full gap-2 md:col-start-3">
                  {total.subTotal !== total.total && (
                    <Box className="grid-child grid grid-cols-2 items-center justify-center">
                      <Typography variant="subtitle2">Sub Total</Typography>
                      <Typography variant="subtitle2" align="right">
                        {formatNumber(total.subTotal)}
                      </Typography>
                    </Box>
                  )}
                  {total.totalDiscountDetail > 0 && (
                    <Box className="grid-child grid grid-cols-2 items-center justify-center">
                      <Typography variant="subtitle2">
                        Total Diskon Baris
                      </Typography>
                      <Typography variant="subtitle2" align="right">
                        {formatNumber(total.totalDiscountDetail)}
                      </Typography>
                    </Box>
                  )}
                  <Box className="grid-child grid grid-cols-2 items-center justify-center">
                    <Typography variant="subtitle2">Total</Typography>
                    <Typography variant="subtitle2" align="right">
                      {formatNumber(total.total)}
                    </Typography>
                  </Box>
                  <Box className="grid-child grid grid-cols-2 items-center justify-center">
                    <Typography variant="subtitle2">Diskon Tambahan</Typography>
                    <TextFieldElement
                      variant="standard"
                      name="discountGroupInput"
                      hiddenLabel
                      InputProps={{
                        inputComponent: NumericFormatCustom as never,
                        disabled: mode === "view",
                        inputProps: {
                          isAllowed: (values: { floatValue: number }) => {
                            const { floatValue } = values;
                            return (floatValue ?? 0) <= (total.total ?? 0);
                          },
                        },
                      }}
                      fullWidth
                      size="small"
                    />
                  </Box>
                  {total.totalDiscount > 0 &&
                    total.totalDiscount !== discountGroupInput && (
                      <Box className="grid-child grid grid-cols-2 items-center justify-center">
                        <Typography variant="subtitle2">
                          Total Diskon
                        </Typography>
                        <Typography variant="subtitle2" align="right">
                          {formatNumber(total.totalDiscount)}
                        </Typography>
                      </Box>
                    )}
                  <Divider />
                  <Box className="grid-child grid grid-cols-2 items-center justify-center">
                    <Typography variant="h6">Total Akhir</Typography>
                    <Typography variant="h6" align="right">
                      {formatNumber(total.grandTotal)}
                    </Typography>
                  </Box>
                  <Box className="grid-child grid grid-cols-2 items-center justify-center">
                    <Typography variant="subtitle2">Bayar (Alt + B)</Typography>
                    <TextFieldElement
                      variant="standard"
                      name="paymentInput"
                      hiddenLabel
                      InputProps={{
                        inputComponent: NumericFormatCustom as never,
                        disabled: mode === "view",
                      }}
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Box className="grid-child grid grid-cols-2 items-center justify-center">
                    <Typography variant="subtitle2">
                      {total.balance <= 0 ? "Kembalian" : "Kurang"}
                    </Typography>
                    <Typography variant="subtitle2" align="right">
                      {formatNumber(
                        total.balance ? total.balance * -1 : total.balance,
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Button type="submit" disabled={isSubmitting} className="hidden">
                Simpan
              </Button>
            </Box>
          </div>
        </FormContainer>
      </DialogContent>
    </>
  );
};

export default PurchaseForm;
