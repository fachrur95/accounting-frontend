import DatePicker from "@/components/controls/DatePicker";
import useNotification from "@/components/hooks/useNotification";
import type { FormSlugType } from "@/types/global";
import type {
  IStockAdjustmentDetailMutation,
  IStockAdjustmentMutation,
} from "@/types/prisma-api/transaction";
import { api } from "@/utils/api";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import DocumentScanner from "@mui/icons-material/DocumentScanner";
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
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
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
import AutocompleteItem from "../../controls/autocompletes/masters/AutocompleteItem";
import AutocompleteMultipleUom from "../../controls/autocompletes/masters/AutocompleteMultipleUom";
import AutocompleteTransaction from "../../controls/autocompletes/transactions/AutocompleteTransaction";

interface IStockAdjustmentForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const basePath = `/other-transactions/stock-adjustments`;

const defaultValues: IStockAdjustmentMutation = {
  transactionParentId: "",
  transactionParent: null,
  entryDate: new Date(),
  transactionNumber: "",
  note: "",
  transactionDetails: [],
};

const StockAdjustmentForm = (props: IStockAdjustmentForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [barcode, setBarcode] = useState<{ code: string; qty: number }>({
    code: "",
    qty: 1,
  });
  const [enteredBarcode, setEnteredBarcode] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<IStockAdjustmentMutation>({ defaultValues });
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

  const transactionParentSelected = useWatch({
    control,
    name: "transactionParent",
  });

  const transactionDetails: IStockAdjustmentDetailMutation[] = useWatch({
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

  const { data: dataParent, isFetching: isFetchingParentSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: transactionParentSelected?.id ?? "xx", withCurrentStock: true },
      {
        enabled: !!transactionParentSelected && mode === "create",
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const { data: dataScanned } = api.item.scanBarcode.useQuery(
    { barcode: enteredBarcode ?? "" },
    {
      enabled: !!enteredBarcode,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  );

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: "STOCK_ADJUSTMENT",
  });

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      setEnteredBarcode(barcode.code);
    }
  };

  const mutationCreate = api.stockAdjustment.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IStockAdjustmentMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IStockAdjustmentMutation) => {
    const dataSave = {
      ...data,
      transactionParentId: data.transactionParent?.id ?? undefined,
      note: data.note === "" || data.note === null ? undefined : data.note,
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
        conversionQty: detail.multipleUom?.conversionQty ?? 0,
        multipleUomId: detail.multipleUom?.id ?? "",
        note:
          detail.note === "" || detail.note === null ? undefined : detail.note,
      })),
    };
    console.log({ dataSave });
    return void mutationCreate.mutate(dataSave);
  };

  useEffect(() => {
    const [path, id] = slug;
    if ((path === "f" || path === "v") && typeof id === "string") {
      setSelectedId(id);
    }
    if (path === "f" && typeof id === "string") {
      setMode("view");
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
    if (dataScanned === null) {
      setOpenNotification("Barcode Not Found");
      setBarcode((prev) => ({ ...prev, code: "" }));
      setEnteredBarcode(null);
    }
    if (dataScanned) {
      const qty = barcode.qty;
      const newRow = {
        itemId: dataScanned.itemId,
        item: {
          id: dataScanned.itemId,
          label: dataScanned.item?.name ?? "",
        },
        multipleUomId: dataScanned.id,
        multipleUom: {
          id: dataScanned.id,
          label:
            dataScanned.unitOfMeasure?.code ??
            dataScanned.unitOfMeasure?.name ??
            "",
          conversionQty: dataScanned.conversionQty,
        },
        qtyInput: qty ?? 1,
        conversionQty: dataScanned.conversionQty,
        note: "",
      };
      const getIndex = transactionDetails.findIndex(
        (detail) => detail.multipleUom?.id === newRow.multipleUomId,
      );
      if (getIndex !== -1) {
        setValue(
          `transactionDetails.${getIndex}.qtyInput`,
          (transactionDetails?.[getIndex]?.qtyInput ?? 1) + (qty ?? 1),
        );
      } else {
        append(newRow, { shouldFocus: false });
      }
      setBarcode((prev) => ({ ...prev, code: "" }));
      setEnteredBarcode(null);
    }
  }, [
    dataScanned,
    append,
    setOpenNotification,
    transactionDetails,
    setValue,
    barcode.qty,
  ]);

  useEffect(() => {
    if (dataParent && mode === "create") {
      for (const key in dataParent) {
        if (Object.prototype.hasOwnProperty.call(dataParent, key)) {
          if (key === "transactionDetails") {
            const transactionDetail = dataParent[key]!;

            if (transactionDetail.length > 0) {
              const dataDetail = transactionDetail.map((row) => {
                let selectedItem = null;
                let selectedUnit = null;
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
                return {
                  transactionDetailParentId: row.id,
                  item: selectedItem,
                  multipleUom: selectedUnit,
                  qtyCount: row.qtyInput,
                  qtyActual: row.qty,
                  qtyInput: row.qtyInput - row.qty,
                  conversionQty: row.conversionQty,
                  note: row.note,
                };
              });
              setValue("transactionDetails", dataDetail);
            }

            continue;
          }

          if (key === "peopleId" || key === "termId") {
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
          if (key === "transactionDetails") {
            const transactionDetail = dataSelected[key]!;

            if (transactionDetail.length > 0) {
              const dataDetail = transactionDetail.map((row) => {
                let selectedItem = null;
                let selectedUnit = null;
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
                return {
                  id: row.id,
                  item: selectedItem,
                  multipleUom: selectedUnit,
                  qtyInput: row.qtyInput,
                  conversionQty: row.conversionQty,
                  note: row.note,
                };
              });
              setValue("transactionDetails", dataDetail);
            }

            continue;
          }

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
            <Typography variant="h6">Penyesuaian Stock</Typography>
          </div>
          <div>
            {mode === "create" && (
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
            <Alert severity="warning">
              <AlertTitle>Perhatian</AlertTitle>
              Transaksi ini tidak dapat disunting/dihapus dikemudian hari
              apabila anda telah menyimpannya. —{" "}
              <strong>Harap perhatikan hal tersebut!</strong> agar tidak ada
              kesalahan stock
            </Alert>
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
                label="No. Stock Opname"
                type="stock_opname"
                autocompleteProps={{
                  disabled: mode !== "create",
                }}
              />
              <DatePicker
                label="Tanggal"
                name="entryDate"
                inputProps={{
                  disabled: mode === "view",
                }}
                slotProps={{
                  openPickerButton: { disabled: mode === "view" },
                }}
              />
            </Box>
            {mode !== "view" && !transactionParentSelected && (
              <Box
                component={Paper}
                className="grid grid-cols-1 gap-4 p-4 md:grid-cols-5"
              >
                <TextField
                  label="Pindai Barcode"
                  value={barcode.code}
                  className="col-span-2"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setBarcode((prev) => ({
                      ...prev,
                      code: event.target.value,
                    }));
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DocumentScanner />
                      </InputAdornment>
                    ),
                  }}
                  onKeyDown={handleBarcodeKeyDown}
                />
                <TextField
                  label="Qty"
                  InputProps={{
                    inputComponent: NumericFormatCustom as never,
                  }}
                  disabled
                  value={barcode.qty}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setBarcode((prev) => ({
                      ...prev,
                      qty: parseFloat(event.target.value) ?? 1,
                    }));
                  }}
                  fullWidth
                />
              </Box>
            )}
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
                          Produk
                        </TableCell>
                        {transactionParentSelected && mode === "create" && (
                          <>
                            <TableCell
                              sx={{
                                width: "10%",
                                minWidth: { xs: 250, md: "auto" },
                              }}
                              align="right"
                            >
                              Qty terhitung
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "10%",
                                minWidth: { xs: 250, md: "auto" },
                              }}
                              align="right"
                            >
                              Qty tercatat
                            </TableCell>
                          </>
                        )}
                        <TableCell
                          sx={{
                            width: "20%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                          align="right"
                        >
                          Penyesuaian Qty
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "10%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                          align="right"
                        >
                          Satuan
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
                          <TableCell align="right">
                            <AutocompleteItem
                              name={`transactionDetails.${index}.item`}
                              required
                              autocompleteProps={{
                                size: "small",
                                disabled:
                                  mode === "view" ||
                                  transactionParentSelected !== undefined ||
                                  transactionParentSelected !== null,
                              }}
                              textFieldProps={{
                                hiddenLabel: true,
                              }}
                            />
                          </TableCell>
                          {transactionParentSelected && mode === "create" && (
                            <>
                              <TableCell align="right">
                                {row.qtyCount}
                              </TableCell>
                              <TableCell align="right">
                                {row.qtyActual}
                              </TableCell>
                            </>
                          )}
                          <TableCell align="right">
                            <TextFieldElement
                              name={`transactionDetails.${index}.qtyInput`}
                              hiddenLabel
                              InputProps={{
                                inputComponent: NumericFormatCustom as never,
                                disabled: mode === "view",
                                inputProps: {
                                  allowNegative: true,
                                },
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
                                disabled:
                                  mode === "view" ||
                                  transactionParentSelected !== undefined ||
                                  transactionParentSelected !== null,
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
                    {!transactionParentSelected && (
                      <TableFooter>
                        {mode !== "view" && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Button
                                startIcon={<Add />}
                                onClick={() =>
                                  void append({
                                    itemId: "",
                                    item: null,
                                    multipleUomId: "",
                                    multipleUom: null,
                                    qtyCount: 0,
                                    qtyActual: 0,
                                    qtyInput: 0,
                                    conversionQty: 0,
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

export default StockAdjustmentForm;
