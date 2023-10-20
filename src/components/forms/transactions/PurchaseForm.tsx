import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
  // useWatch,
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
import type {
  IPurchaseMutation,
  ISalesPurchaseDetailMutation,
} from "@/types/prisma-api/transaction";
// import AutocompleteChartOfAccount from "../../controls/autocompletes/masters/AutocompleteChartOfAccount";
import AutocompleteItem from "../../controls/autocompletes/masters/AutocompleteItem";
import AutocompleteMultipleUom from "../../controls/autocompletes/masters/AutocompleteMultipleUom";
import AutocompletePeople from "../../controls/autocompletes/masters/AutocompletePeople";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import { formatNumber } from "@/utils/helpers";
import useNotification from "@/components/hooks/useNotification";

interface IPurchaseForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

type TotalType = {
  subTotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
};

const basePath = `/purchase`;

const defaultValues: IPurchaseMutation = {
  transactionNumber: "",
  peopleId: "",
  people: null,
  termId: "",
  term: null,
  chartOfAccountId: "",
  chartOfAccount: null,
  paymentInput: 0,
  note: "",
  transactionDetails: [],
};

const PurchaseForm = (props: IPurchaseForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /* const [total, setTotal] = useState<TotalType>({
    subTotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
  }); */
  const formContext = useForm<IPurchaseMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    control,
    setValue,
    watch,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "transactionDetails",
  });

  // const transactionDetails = useWatch({ control, name: "transactionDetails" });
  const transactionDetails: ISalesPurchaseDetailMutation[] =
    watch("transactionDetails");

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
    transactionType: "PURCHASE_INVOICE",
  });

  // console.log({ dataNumber });

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
    const dataSave: IPurchaseMutation = {
      ...data,
      note: data.note === "" || data.note === null ? undefined : data.note,
      chartOfAccountId: data.chartOfAccount?.id ?? undefined,
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

  /* useEffect(() => {
    if (transactionDetails) {
      const sumTotal = transactionDetails.reduce<TotalType>(
        (obj, detail) => {
          obj.debit += detail.debit;
          obj.credit += detail.credit;
          return obj;
        },
        { debit: 0, credit: 0 },
      );
      setTotal(sumTotal);
    }
  }, [transactionDetails]); */

  useEffect(() => {
    if (dataSelected) {
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
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
                    label: row.multipleUom.item?.name ?? "",
                  };
                  selectedUnit = {
                    id: row.multipleUom.id,
                    label: row.multipleUom.unitOfMeasure?.name ?? "",
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
          // "itemCategory" | "transactionDetails" | "tax" | "files" | "id"

          if (
            key === "transactionNumber" ||
            key === "peopleId" ||
            key === "termId" ||
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
                label="Pemasok"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
                type="supplier"
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
                        <TableCell width="3%" align="right">
                          No
                        </TableCell>
                        <TableCell width="26%">Produk</TableCell>
                        <TableCell width="8%" align="right">
                          Qty
                        </TableCell>
                        <TableCell width="15%" align="right">
                          Satuan
                        </TableCell>
                        <TableCell width="15%" align="right">
                          Harga Satuan
                        </TableCell>
                        <TableCell width="10%" align="right">
                          Diskon
                        </TableCell>
                        <TableCell width="10%" align="right">
                          Total
                        </TableCell>
                        <TableCell width="10%">Catatan</TableCell>
                        <TableCell width="3%" align="center">
                          <Delete />
                        </TableCell>
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
                                /* onChange: (_, data) => {
                                  if (!transactionDetails[index]?.priceInput) {
                                    setValue(
                                      `transactionDetails.${index}.priceInput`,
                                      (data as IDataOption | null)?.price ?? 0,
                                    );
                                  }
                                }, */
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
                                ((transactionDetails[index]?.priceInput ?? 0) -
                                  (transactionDetails[index]?.discountInput ??
                                    0)),
                            )}
                          </TableCell>
                          <TableCell>
                            <TextFieldElement
                              name={`transactionDetails.${index}.note`}
                              hiddenLabel
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => void remove(index)}
                              color="error"
                              size="small"
                            >
                              <Close />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      {mode !== "view" && (
                        <TableRow>
                          <TableCell colSpan={9}>
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

export default PurchaseForm;
