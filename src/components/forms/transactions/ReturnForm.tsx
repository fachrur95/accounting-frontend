import DatePicker from "@/components/controls/DatePicker";
import useNotification from "@/components/hooks/useNotification";
import type { FormSlugType } from "@/types/global";
import type { ISalesPurchaseReturnMutation } from "@/types/prisma-api/transaction";
import { api } from "@/utils/api";
import { formatNumber } from "@/utils/helpers";
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
import AutocompleteItem from "../../controls/autocompletes/masters/AutocompleteItem";
import AutocompleteMultipleUom from "../../controls/autocompletes/masters/AutocompleteMultipleUom";
import AutocompletePeople from "../../controls/autocompletes/masters/AutocompletePeople";
import AutocompleteTransaction from "../../controls/autocompletes/transactions/AutocompleteTransaction";

interface IReturnForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
  type: "sales" | "purchase";
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

const defaultValues: ISalesPurchaseReturnMutation = {
  transactionParentId: "",
  transactionParent: null,
  entryDate: new Date(),
  transactionNumber: "",
  peopleId: "",
  people: null,
  chartOfAccountId: "",
  chartOfAccount: null,
  paymentInput: 0,
  note: "",
  transactionDetails: [],
};

const ReturnForm = (props: IReturnForm) => {
  const { slug, showIn, type } = props;
  const router = useRouter();
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
  const formContext = useForm<ISalesPurchaseReturnMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const basePath = `/${type}/returns`;

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

  const transactionParentSelected = useWatch({
    control,
    name: "transactionParent",
  });

  const transactionDetails = useWatch({
    control,
    name: "transactionDetails",
  });
  const paymentInput: number = useWatch({ control, name: "paymentInput" });

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const { data: dataParent, isFetching: isFetchingParentSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: transactionParentSelected?.id ?? "xx" },
      {
        enabled: !!transactionParentSelected && mode === "create",
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: type === "sales" ? "SALE_RETURN" : "PURCHASE_RETURN",
  });

  const mutationCreate = api.return.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof ISalesPurchaseReturnMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.return.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof ISalesPurchaseReturnMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: ISalesPurchaseReturnMutation) => {
    const dataSave = {
      ...data,
      transactionParentId: data.transactionParent?.id ?? "",
      note: data.note === "" || data.note === null ? undefined : data.note,
      chartOfAccountId: data.chartOfAccount?.id ?? undefined,
      peopleId: data.people?.id ?? "",
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
        conversionQty: detail.multipleUom?.conversionQty ?? 0,
        multipleUomId: detail.multipleUom?.id ?? "",
        taxId: detail.tax?.id ?? undefined,
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
    if (transactionDetails) {
      const sumTotal = transactionDetails.reduce<
        Omit<TotalType, "grandTotal" | "balance" | "totalDiscount">
      >(
        (obj, detail) => {
          const qty =
            detail.qtyInput * (detail.multipleUom?.conversionQty ?? 0);
          const subTotal = qty * detail.priceInput;
          const total = subTotal;

          obj.subTotal += subTotal;
          obj.total += total;
          return obj;
        },
        { subTotal: 0, totalDiscountDetail: 0, totalTax: 0, total: 0 },
      );
      const total = sumTotal.total;
      const grandTotal = total;
      const balance = grandTotal - paymentInput;
      const totalDiscount = sumTotal.totalDiscountDetail;
      setTotal({ ...sumTotal, totalDiscount, grandTotal, balance });
    }
  }, [transactionDetails, paymentInput]);

  useEffect(() => {
    if (dataParent && mode === "create") {
      for (const key in dataParent) {
        if (Object.prototype.hasOwnProperty.call(dataParent, key)) {
          if (key === "people") {
            const selectedPeople = dataParent[key]!;
            if (selectedPeople) {
              setValue("people", {
                id: selectedPeople.id,
                label: selectedPeople.name,
              });
            }
            continue;
          }
          if (key === "transactionDetails") {
            const transactionDetail = dataParent[key]!;

            if (transactionDetail.length > 0) {
              const dataDetail = transactionDetail.map((row) => {
                let selectedItem = null;
                let selectedUnit = null;
                let selectedAccount = null;
                let selectedTax = null;
                if (row.multipleUom) {
                  selectedItem = {
                    id: row.multipleUom.item?.id ?? "",
                    label: row.multipleUom.item?.name ?? "",
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
                  transactionDetailParentId: row.id,
                  item: selectedItem,
                  multipleUom: selectedUnit,
                  chartOfAccount: selectedAccount,
                  tax: selectedTax,
                  qtyInput: row.qtyInput,
                  conversionQty: row.conversionQty,
                  priceInput: row.priceInput,
                  note: row.note,
                };
              });
              setValue("transactionDetails", dataDetail);
            }

            continue;
          }

          if (key === "peopleId") {
            setValue(key, dataParent[key]);
          }
        }
      }
    }
  }, [dataParent, mode, setValue]);

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
                label: selectedPeople.name,
              });
            }
            continue;
          }
          if (key === "transactionParent") {
            const selectedTransactionParent = dataSelected[key]!;
            if (selectedTransactionParent) {
              setValue("transactionParent", {
                id: selectedTransactionParent.id,
                label: selectedTransactionParent.transactionNumber,
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
                    label: row.multipleUom.item?.name ?? "",
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
                  transactionDetailParentId: row.transactionDetailParentId,
                  item: selectedItem,
                  multipleUom: selectedUnit,
                  chartOfAccount: selectedAccount,
                  tax: selectedTax,
                  qtyInput: row.qtyInput,
                  conversionQty: row.conversionQty,
                  priceInput: row.priceInput,
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
            key === "chartOfAccountId" ||
            key === "paymentInput" ||
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
        open={isFetchingSelected || isFetchingParentSelected}
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
            <Typography variant="h6">{`Return ${
              type === "sales" ? "Penjualan" : "Pembelian"
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
              <AutocompleteTransaction
                name="transactionParent"
                label="No. Invoice"
                required
                type={`${type}_invoice`}
                autocompleteProps={{
                  disabled: mode !== "create",
                }}
              />
              <AutocompletePeople
                name="people"
                label="Pemasok"
                required
                autocompleteProps={{
                  disabled: true,
                }}
                type="supplier"
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
              {paymentInput > 0 && (
                <AutocompleteChartOfAccount
                  name="chartOfAccount"
                  label="Akun Pengembalian"
                  autocompleteProps={{
                    disabled: mode === "view",
                  }}
                  type="cash-bank"
                  required={paymentInput > 0}
                />
              )}
            </Box>
            <div className="overflow-auto">
              <Box component={Paper} className="table w-full table-fixed">
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ maxHeight: 440 }}
                >
                  <Table
                    stickyHeader
                    size="small"
                    sx={{ "& .MuiTableCell-root": { px: "6px" } }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{ width: "3%", minWidth: { xs: 80, md: "auto" } }}
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
                          Total
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
                                disabled: true,
                              }}
                              textFieldProps={{
                                hiddenLabel: true,
                              }}
                            />
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
                              itemId={transactionDetails[index]?.item?.id ?? ""}
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
                            {formatNumber(
                              (transactionDetails[index]?.qtyInput ?? 0) *
                                (transactionDetails[index]?.multipleUom
                                  ?.conversionQty ?? 0) *
                                (transactionDetails[index]?.priceInput ?? 0),
                            )}
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
                {/* <Box className="grid-child grid grid-cols-2 items-center justify-center">
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
                </Box> */}
                <Divider />
                <Box className="grid-child grid grid-cols-2 items-center justify-center">
                  <Typography variant="h6">Total Akhir</Typography>
                  <Typography variant="h6" align="right">
                    {formatNumber(total.grandTotal)}
                  </Typography>
                </Box>
                <Box className="grid-child grid grid-cols-2 items-center justify-center">
                  <Typography variant="subtitle2">
                    Dikembalikan Langsung
                  </Typography>
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
          </div>
        </FormContainer>
      </DialogContent>
    </>
  );
};

export default ReturnForm;
