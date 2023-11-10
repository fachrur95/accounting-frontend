import DatePicker from "@/components/controls/DatePicker";
import type { FormSlugType } from "@/types/global";
import type { IBeginBalanceStockMutation } from "@/types/prisma-api/transaction";
import { api } from "@/utils/api";
import Close from "@mui/icons-material/Close";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
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
import useNotification from "@/components/hooks/useNotification";
// import { formatNumber } from "@/utils/helpers";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useRouter } from "next/router";
// import AutocompleteItem from "../../controls/autocompletes/masters/AutocompleteItem";
// import AutocompleteMultipleUom from "../../controls/autocompletes/masters/AutocompleteMultipleUom";
import debounce from "lodash.debounce";
import type { PaginationResponse } from "@/types/api-response";
import type { IItem } from "@/types/prisma-api/item";
import TextField from "@mui/material/TextField";
import { useInView } from "react-intersection-observer";
// import SearchIcon from "@mui/icons-material/Search";

interface IBeginBalanceStockForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const basePath = `/other-transactions/beginning-balances/stocks`;

const defaultValues: IBeginBalanceStockMutation = {
  entryDate: new Date(),
  transactionNumber: "",
  chartOfAccountId: "",
  chartOfAccount: null,
  note: "",
  transactionDetails: [],
};

const BeginningBalanceStockForm = (props: IBeginBalanceStockForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const { ref, inView } = useInView();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rows, setRows] = useState<IItem[]>([]);
  const [countAll, setCountAll] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const formContext = useForm<IBeginBalanceStockMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { fields } = useFieldArray({
    control,
    name: "transactionDetails",
  });

  // const test = useWatch({ control, name: "transactionDetails" });

  // console.log({ test });

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: selectedId ?? "" },
      { enabled: !!selectedId, refetchOnWindowFocus: false },
    );

  const onSearch = debounce(
    (event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSearch(event?.target.value ?? "");
    },
    150,
  );

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: "BEGINNING_BALANCE_STOCK",
  });

  const {
    data: dataItems,
    fetchNextPage,
    hasNextPage,
    // refetch,
    // isFetching,
  } = api.item.findAll.useInfiniteQuery(
    {
      limit: 100,
    },
    {
      getNextPageParam: (lastPage: PaginationResponse<IItem>) =>
        typeof lastPage.currentPage === "number" && rows.length < countAll
          ? (lastPage.currentPage ?? 0) + 1
          : undefined,
      enabled: mode === "create",
      refetchOnWindowFocus: false,
    },
  );

  const mutationCreate = api.beginBalanceStock.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IBeginBalanceStockMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.beginBalanceStock.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IBeginBalanceStockMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IBeginBalanceStockMutation) => {
    const dataSave: IBeginBalanceStockMutation = {
      ...data,
      note: data.note === "" || data.note === null ? undefined : data.note,
      chartOfAccountId: data.chartOfAccount?.id ?? undefined,
      transactionDetails: data.transactionDetails.map((detail) => ({
        ...detail,
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
    if (dataItems && mode === "create") {
      const dataRows: IItem[] = dataItems?.pages
        .map((page) => page.rows.map((row: IItem) => row))
        .flat();
      const dataCountAll: number = dataItems.pages[0]?.countAll ?? 0;
      setRows(dataRows);
      setCountAll(dataCountAll);
    }
  }, [dataItems, mode]);

  useEffect(() => {
    if (mode === "create") {
      const dataDetails = rows.map((row) => ({
        multipleUomId:
          row.multipleUoms.filter((uom) => uom.conversionQty === 1)?.[0]?.id ??
          "",
        itemName: `${row.code} - ${row.name}`,
        unit:
          row.multipleUoms.filter((uom) => uom.conversionQty === 1)?.[0]
            ?.unitOfMeasure?.code ?? "",
        qtyInput: 0,
        conversionQty: 1,
        priceInput: 0,
        note: "",
      }));
      setValue("transactionDetails", dataDetails);
    }
  }, [rows, setValue, mode]);

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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
                return {
                  id: row.id,
                  multipleUomId: row.multipleUom?.id ?? "",
                  itemName:
                    `${row.multipleUom?.item?.code ?? ""} - ${
                      row.multipleUom?.item?.name ?? ""
                    }` ?? "",
                  unit: row.multipleUom?.unitOfMeasure?.name ?? "",
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
          // "itemCategory" | "transactionDetails" | "tax" | "files" | "id"

          if (
            key === "transactionNumber" ||
            key === "chartOfAccountId" ||
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
            <Typography variant="h6">Saldo Awal Stock Barang</Typography>
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
                disabled={mode === "view"}
              />
            </Box>
            {/* <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-5"
            >*/}
            <div className="flex flex-col gap-2 overflow-auto">
              <Box
                component={Paper}
                className="flex flex-col items-center gap-2 p-2 lg:flex-row"
              >
                <TextField
                  label="Cari"
                  className="col-span-2"
                  size="small"
                  onChange={onSearch}
                />
              </Box>
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
                            width: "45%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Barang
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                          align="right"
                        >
                          Stock
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "10%",
                            minWidth: { xs: 100, md: "auto" },
                          }}
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
                          HPP per Satuan
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "10%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Catatan
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fields
                        .filter((field) =>
                          search !== "" &&
                          search !== undefined &&
                          search !== null
                            ? field.itemName.toLowerCase().includes(search)
                            : true,
                        )
                        .map((row, index) => (
                          <TableRow
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row" align="right">
                              {index + 1}
                            </TableCell>
                            <TableCell>{row.itemName}</TableCell>
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
                            <TableCell>{row.unit}</TableCell>
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
                              {index === rows.length - 1 && (
                                <div className="invisible" ref={ref}></div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <Box component={Paper} className="p-2 text-right">
                <Typography variant="subtitle2">
                  {rows.length !== countAll
                    ? `${rows.length} dari ${countAll} data`
                    : `${countAll} data`}
                </Typography>
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

export default BeginningBalanceStockForm;
