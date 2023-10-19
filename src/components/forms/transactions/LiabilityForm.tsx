import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
  FormContainer,
  SwitchElement,
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
import type { IDataOption } from "@/types/options";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
// import type { IItemCategory } from "@/types/prisma-api/item-category";

/* type MasterItemBodyType = ILiabilityMutation & {
  itemCategory: IDataOption | IItemCategory | null;
  tax: IDataOption | IPeople | null;
}; */

const defaultValues: ILiabilityMutation = {
  transactionNumber: null,
  chartOfAccountId: null,
  chartOfAccount: "",
  peopleId: "",
  people: "",
  entryDate: new Date(),
  note: "",
  transactionDetails: [],
};

interface ILiabilityForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
  type: "revenue" | "expense";
}

const LiabilityForm = (props: ILiabilityForm) => {
  const { slug, showIn, type } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [defaultUnit, setDefaultUnit] = useState<string | null>(null);
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

  // const test = useWatch(control, "transactionDetails[0].chartOfAccount.name");

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
    transactionType: "REVENUE",
  });

  // console.log({ dataNumber });

  const mutationCreate = api.liability.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
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
    const dataSave: ILiabilityMutation = {
      ...data,
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
    };
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
    if (dataSelected) {
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
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
                const selectedTax = {
                  id: row.tax?.id ?? "",
                  label: row.tax?.name ?? "",
                };
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
          // "itemCategory" | "transactionDetails" | "tax" | "files" | "id"

          setValue(
            key as keyof (keyof Pick<
              ILiabilityMutation,
              | "transactionNumber"
              | "chartOfAccountId"
              | "peopleId"
              | "entryDate"
              | "note"
            >),
            dataSelected[
              key as keyof Pick<
                ILiabilityMutation,
                | "transactionNumber"
                | "chartOfAccountId"
                | "peopleId"
                | "entryDate"
                | "note"
              >
            ],
          );
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
            <Typography variant="h6">Produk</Typography>
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
              <AutocompleteChartOfAccount
                name="chartOfAccount"
                label="Akun"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
              <AutocompletePeople
                name="people"
                label="Customer"
                autocompleteProps={{
                  disabled: mode === "view",
                }}
                type="customer"
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
                        <TableCell width="50%">Sumber Akun</TableCell>
                        <TableCell width="25%" align="right">
                          Nilai
                        </TableCell>
                        <TableCell width="15%">Catatan</TableCell>
                        <TableCell width="5%" align="center">
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
                            <AutocompleteChartOfAccount
                              name={`transactionDetails.${index}.chartOfAccount`}
                              required
                              autocompleteProps={{
                                size: "small",
                                disabled: mode === "view",
                                onChange: (_, data) => {
                                  if (index === 0) {
                                    setDefaultUnit(
                                      (data as IDataOption | null)?.label ??
                                        null,
                                    );
                                  }
                                },
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
                              }}
                              fullWidth
                              size="small"
                            />
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
            {/* <Box className="flex flex-col justify-between md:flex-row">
            <div></div>
            <div>
              {mode === "view" ? (
                <Button
                  variant="contained"
                  type="button"
                  fullWidth
                  onClick={() =>
                    router.push(
                      {
                        pathname: basePath,
                        query: { slug: ["f", selectedId] },
                      },
                      `${basePath}/f/${selectedId}`,
                    )
                  }
                >
                  Sunting
                </Button>
              ) : (
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isSubmitting}
                  fullWidth
                >
                  Simpan
                </Button>
              )}
            </div>
          </Box> */}
          </div>
        </FormContainer>
      </DialogContent>
    </>
  );
};

export default LiabilityForm;
