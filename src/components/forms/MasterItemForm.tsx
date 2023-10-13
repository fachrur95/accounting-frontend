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
import AutocompleteItemCategory from "../controls/autocompletes/masters/AutocompleteItemCategory";
import NumericFormatCustom from "../controls/NumericFormatCustom";
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
import type { IItemMutation } from "@/types/prisma-api/item";
import type { ITax } from "@/types/prisma-api/tax";
import AutocompleteUnitOfMeasure from "../controls/autocompletes/masters/AutocompleteUnitOfMeasure";
import type { IDataOption } from "@/types/options";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
// import type { IItemCategory } from "@/types/prisma-api/item-category";

/* type MasterItemBodyType = IItemMutation & {
  itemCategory: IDataOption | IItemCategory | null;
  tax: IDataOption | ITax | null;
}; */

const defaultUom = {
  unitOfMeasureId: "",
  conversionQty: 1,
  barcode: "",
  unitOfMeasure: null,
};

const defaultValues: IItemMutation = {
  itemCategory: null,
  tax: null,
  itemCategoryId: "",
  taxId: "",
  code: "",
  name: "",
  description: "",
  minQty: 0,
  maxQty: 0,
  manualCogs: 0,
  note: "",
  isActive: true,
  multipleUoms: [defaultUom],
  files: [],
};

interface IMasterItemForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const MasterItemForm = (props: IMasterItemForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [defaultUnit, setDefaultUnit] = useState<string | null>(null);
  const formContext = useForm<IItemMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    control,
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const {
    fields: fieldsUnit,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: "multipleUoms",
  });

  // const test = useWatch(control, "multipleUoms[0].unitOfMeasure.name");

  /* console.log({
    test,
    getValues: getValues(`multipleUoms[0]?.unitOfMeasure?.name`),
    watch: watch(`multipleUoms[0]?.unitOfMeasure?.name`),
  }); */

  // const defaultUnit = watch("multipleUoms");
  // const selectedCategory = watch("itemCategory");
  // const currentVariantCategory = watch("variantCategories");
  // const currentVariants = watch("variants");

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.item.findOne.useQuery(
      { id: selectedId ?? "" },
      { enabled: !!selectedId, refetchOnWindowFocus: false },
    );

  const mutationCreate = api.item.create.useMutation({
    onSuccess: () => void router.push("/masters/products"),
    onError: (error) => {
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IItemMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.item.update.useMutation({
    onSuccess: () => void router.push("/masters/products"),
    onError: (error) => {
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IItemMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IItemMutation) => {
    // const check = data.multipleUoms.some((unit) => unit.unitOfMeasure === null)
    let baseUnit: string | null = null;
    let unitTemp: string | null | undefined = null;
    let conversionQtyTemp = 1;
    for (const [index, unit] of data.multipleUoms.entries()) {
      if (unit.conversionQty === 1 && index === 0) {
        if (!unit.unitOfMeasure) {
          return setOpenNotification("Silahkan pilih satuan dasar!", {
            variant: "error",
          });
        }
        baseUnit = unit.unitOfMeasure.id;
        continue;
      }
      if (
        unit.unitOfMeasure?.id === baseUnit ||
        unit.unitOfMeasure?.id === unitTemp
      ) {
        return setOpenNotification(
          "Tidak boleh memilih satuan dasar yg sama lebih dari 1!",
          {
            variant: "error",
          },
        );
      }
      if (unit.conversionQty <= 1) {
        return setOpenNotification(
          "Nilai konversi selain satuan dasar harus bernilai > 1!",
          {
            variant: "error",
          },
        );
      }
      if (unit.conversionQty === conversionQtyTemp) {
        return setOpenNotification(
          "Nilai konversi tidak boleh bernilai sama satu dengan yg lain!",
          {
            variant: "error",
          },
        );
      }
      unitTemp = unit.unitOfMeasure?.id;
      conversionQtyTemp = unit.conversionQty;
    }
    const dataSave: IItemMutation = {
      ...data,
      description:
        data.description === "" || data.description === null
          ? undefined
          : data.description,
      note: data.note === "" || data.note === null ? undefined : data.note,
      itemCategoryId: data.itemCategory?.id ?? "",
      taxId: data.tax?.id ?? undefined,
      multipleUoms: data.multipleUoms.map((unit) => ({
        ...unit,
        unitOfMeasureId: unit.unitOfMeasure?.id ?? "",
        barcode:
          unit.barcode === "" || unit.barcode === null
            ? undefined
            : unit.barcode,
      })),
    };
    // console.log({ dataSave });
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
          if (key === "itemCategory") {
            const selectedCategory = dataSelected[key]!;
            if (selectedCategory) {
              setValue("itemCategory", {
                id: selectedCategory.id,
                label: selectedCategory.name,
              });
            }
            continue;
          }
          if (key === "tax") {
            const selectedTax = dataSelected[key] as ITax | null;
            if (selectedTax) {
              setValue("tax", {
                id: selectedTax.id,
                label: selectedTax.name,
              });
            }
            continue;
          }
          if (key === "multipleUoms") {
            const multipleUnit = dataSelected[key]!;

            if (multipleUnit.length > 0) {
              const dataUnit = multipleUnit.map((unit) => {
                const selectedUnit = {
                  id: unit.unitOfMeasure?.id ?? "",
                  label: unit.unitOfMeasure?.name ?? "",
                };
                if (unit.conversionQty === 1) {
                  setDefaultUnit(unit.unitOfMeasure?.name ?? "");
                }
                return {
                  id: unit.id,
                  unitOfMeasure: selectedUnit,
                  conversionQty: unit.conversionQty,
                  barcode: unit.barcode,
                };
              });
              setValue("multipleUoms", dataUnit);
            }

            continue;
          }
          if (key === "files") {
            continue;
          }
          // "itemCategory" | "multipleUoms" | "tax" | "files" | "id"

          setValue(
            key as keyof (keyof Pick<
              IItemMutation,
              | "itemCategoryId"
              | "taxId"
              | "code"
              | "name"
              | "description"
              | "minQty"
              | "maxQty"
              | "manualCogs"
              | "note"
              | "isActive"
            >),
            dataSelected[
              key as keyof Pick<
                IItemMutation,
                | "itemCategoryId"
                | "taxId"
                | "code"
                | "name"
                | "description"
                | "minQty"
                | "maxQty"
                | "manualCogs"
                | "note"
                | "isActive"
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
            <Link href="/masters/products">
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
                onClick={() => router.push(`/masters/products/f/${selectedId}`)}
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
                name="code"
                label="Kode"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
              />
              <TextFieldElement
                name="name"
                label="Nama Produk"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
              />
            </Box>
            <Box
              component={Paper}
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextareaAutosizeElement
                name="description"
                label="Deskripsi"
                rows={3}
                className="col-start-1"
                disabled={mode === "view"}
              />
              <AutocompleteItemCategory
                name="itemCategory"
                label="Kategori Produk"
                required
                autocompleteProps={{
                  disabled: mode === "view",
                }}
              />
            </Box>
            <Box
              component={Paper}
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextFieldElement
                name="minQty"
                label="Minimum Stock"
                InputProps={{
                  inputComponent: NumericFormatCustom as never,
                  disabled: mode === "view",
                }}
              />
              <TextFieldElement
                name="maxQty"
                label="Maximum Stock"
                InputProps={{
                  inputComponent: NumericFormatCustom as never,
                  disabled: mode === "view",
                }}
              />
              <TextFieldElement
                name="manualCogs"
                label="HPP Manual (diisi jika pengaturan manual)"
                InputProps={{
                  inputComponent: NumericFormatCustom as never,
                  disabled: mode === "view",
                }}
              />
              <TextareaAutosizeElement
                name="note"
                label="Catatan"
                rows={3}
                className="col-start-1"
                disabled={mode === "view"}
              />
            </Box>
            <Box
              component={Paper}
              variant="outlined"
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <SwitchElement
                name="isActive"
                label="Aktif"
                switchProps={{ disabled: mode === "view" }}
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
                        <TableCell width="30%">Satuan</TableCell>
                        <TableCell width="15%" align="right">
                          Qty
                        </TableCell>
                        <TableCell width="15%">Satuan Dasar</TableCell>
                        <TableCell width="20%">Barcode</TableCell>
                        <TableCell width="5%" align="center">
                          <Delete />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fieldsUnit.map((row, index) => (
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
                            <AutocompleteUnitOfMeasure
                              name={`multipleUoms.${index}.unitOfMeasure`}
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
                              name={`multipleUoms.${index}.conversionQty`}
                              hiddenLabel
                              InputProps={{
                                inputComponent: NumericFormatCustom as never,
                                disabled: index === 0,
                              }}
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{defaultUnit ?? "-"}</TableCell>
                          <TableCell>
                            <TextFieldElement
                              name={`multipleUoms.${index}.barcode`}
                              hiddenLabel
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => void removeUnit(index)}
                              color="error"
                              size="small"
                              disabled={index === 0}
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
                                void appendUnit({
                                  unitOfMeasureId: "",
                                  unitOfMeasure: null,
                                  conversionQty: 0,
                                  barcode: "",
                                })
                              }
                              size="large"
                              fullWidth
                            >
                              Tambah Satuan
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    )}
                  </Table>
                </TableContainer>
              </Box>
            </div>
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
                        pathname: "/masters/products",
                        query: { slug: ["f", selectedId] },
                      },
                      `/masters/products/f/${selectedId}`,
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

export default MasterItemForm;
