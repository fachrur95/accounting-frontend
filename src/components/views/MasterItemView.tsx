import type { IMasterItem } from "@/types/masters/masterItem";
import type { IDataOption } from "@/types/options";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  TableFooter,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import {
  AutocompleteElement,
  CheckboxElement,
  FormContainer,
  RadioButtonGroup,
  // SelectElement,
  SwitchElement,
  TextFieldElement,
  TextareaAutosizeElement,
  useFieldArray,
  useForm,
} from "react-hook-form-mui";
import Close from "@mui/icons-material/Close";
import Add from "@mui/icons-material/Add";
import Delete from "@mui/icons-material/Delete";
import AutocompleteMasterItemCategory from "../controls/autocompletes/masters/AutocompleteItemCategory";
import AutocompleteMasterOther from "../controls/autocompletes/masters/AutocompleteMasterOther";
import NumericFormatCustom from "../controls/NumericFormatCustom";
import Collapse from "@mui/material/Collapse";
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
import fastCartesian from "fast-cartesian";
import { isJson } from "@/utils/helpers";
import type { FormSlugType } from "@/types/global";

type MultipleUnitType = {
  id?: string;
  item_uom: IDataOption | null;
  masteritemuom_convertionqty: number;
  masteritemuom_barcode: string;
};

type VariantCoreType = {
  id?: string;
  name: string;
  values: string[];
};

type VariantResultType = {
  id?: string;
  unit: IDataOption & { convertionqty: number; barcode?: string | null };
  description: string;
  barcode: string;
  price: number;
};

type MasterItemBodyType = Pick<
  IMasterItem,
  | "masteritem_qtysellmin"
  | "masteritem_qtysellmax"
  | "masteritem_priceinputdefault"
  | "masteritem_description"
  | "masteritem_alias"
  | "masteritem_catatan"
  | "masteritem_barcode"
  | "masteritem_isserialbatch"
  | "masteritem_stockmin"
  | "masteritem_stockmax"
  | "masteritem_oleh"
  | "masteritem_active"
> & {
  masteritemcategory: IDataOption | null;
  item_brand: IDataOption | null;
  item_tax: IDataOption | null;
  item_uom: IDataOption | null;
  stock: boolean;
  sales: boolean;
  purchase: boolean;
  assembly: boolean;
  disassembly: boolean;
  transfer: boolean;
  beginBalance: boolean;
  adjust: boolean;
  formula: boolean;
  material: boolean;
  modify: boolean;
  isMultipleUnit: boolean;
  isVariant: boolean;
  multiple_uom: MultipleUnitType[];
  variantCategories: VariantCoreType[];
  variants: VariantResultType[];
};

const defaultValues: MasterItemBodyType = {
  masteritemcategory: null,
  item_brand: null,
  item_tax: null,
  item_uom: null,
  stock: false,
  sales: false,
  purchase: false,
  assembly: false,
  disassembly: false,
  transfer: false,
  beginBalance: false,
  adjust: false,
  formula: false,
  material: false,
  modify: false,

  masteritem_description: "",
  masteritem_alias: "",
  masteritem_catatan: "",
  masteritem_barcode: "",
  masteritem_oleh: "",
  masteritem_isserialbatch: "N",
  masteritem_stockmin: 0,
  masteritem_stockmax: 0,
  masteritem_qtysellmin: 0,
  masteritem_qtysellmax: 0,
  masteritem_priceinputdefault: 0,
  isMultipleUnit: false,
  isVariant: false,
  multiple_uom: [],
  variantCategories: [],
  variants: [],
  masteritem_active: true,
};

interface IMasterItemForm {
  slug: FormSlugType;
}

const MasterItemView = (props: IMasterItemForm) => {
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<MasterItemBodyType>({ defaultValues });
  const { slug } = props;

  console.log({ mode });

  const {
    control,
    setValue,
    getValues,
    formState: { isSubmitting },
    // reset,
    // setError,
    watch,
  } = formContext;

  const {
    fields: fieldsUnit,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: "multiple_uom",
  });

  const {
    fields: fieldsVariantCategory,
    append: appendVariantCategory,
    remove: removeVariantCategory,
  } = useFieldArray({
    control,
    name: "variantCategories",
  });

  const { fields: fieldsVariant } = useFieldArray({
    control,
    name: "variants",
  });

  const selectedCategory = watch("masteritemcategory");
  const selectedUnitBase = watch("item_uom");
  const isMultipleUnit = watch("isMultipleUnit");
  // const currentVariantCategory = watch("variantCategories");
  // const currentVariants = watch("variants");

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.masterItem.getUnique.useQuery(
      { id: selectedId ?? "" },
      { enabled: !!selectedId, refetchOnWindowFocus: false },
    );

  const { data: dataCategory } = api.masterItemCategory.getUnique.useQuery(
    { id: selectedCategory?.id ?? "" },
    { enabled: !!selectedCategory },
  );

  const handleRenderVariants = useCallback((): void => {
    const variantCategories = getValues("variantCategories");
    const variantsOld = getValues("variants");
    const multiUnit = isMultipleUnit ? getValues("multiple_uom") : [];

    const allUnit = selectedUnitBase
      ? [
          {
            id: selectedUnitBase.id,
            label: selectedUnitBase.label,
            convertionqty: 1,
            barcode: "",
          },
        ]
      : [];

    for (const unit of multiUnit) {
      if (unit.item_uom) {
        allUnit.push({
          id: unit.item_uom.id,
          label: unit.item_uom.label,
          convertionqty: unit.masteritemuom_convertionqty,
          barcode: unit.masteritemuom_barcode,
        });
      }
    }

    const values = variantCategories.map(
      (variantCategory) => variantCategory.values,
    );
    const cartesianValues = fastCartesian(values);

    const cartesianResult: VariantResultType[] = allUnit
      .map((unit) => {
        const result: VariantResultType[] = cartesianValues.map((value) => {
          const newValue = value.join(" ");
          const foundMatch = variantsOld.find(
            (variant) =>
              variant.description === newValue && variant.unit.id === unit.id,
          );
          return {
            id: foundMatch?.id,
            unit,
            description: newValue,
            barcode: unit.barcode,
            price: 0,
          };
        });
        return result;
      })
      .flat();
    // console.log({ cartesianResult });

    setValue("variants", cartesianResult);
  }, [getValues, selectedUnitBase, setValue, isMultipleUnit]);

  const onSubmit = (data: MasterItemBodyType) => {
    console.log({ data });
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
      const variantNames: string[] =
        isJson(dataSelected.masteritem_variantparent) &&
        dataSelected.masteritem_variantparent
          ? (JSON.parse(dataSelected.masteritem_variantparent) as string[])
          : [];
      const variantValues: string[][] =
        isJson(dataSelected.masteritem_variantcontent) &&
        dataSelected.masteritem_variantcontent
          ? (JSON.parse(dataSelected.masteritem_variantcontent) as string[][])
          : [];

      const dataVariantCategory: VariantCoreType[] = variantNames.map(
        (variantName, index) => ({
          name: variantName,
          values: variantValues?.[index] ?? [],
        }),
      );

      setValue("variantCategories", dataVariantCategory);
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
          if (
            key === "masteritem_variantparent" ||
            key === "masteritem_variantcontent"
          )
            continue;

          if (key === "masteritemcategory") {
            setValue("masteritemcategory", {
              // ...dataSelected.masteritemcategory,
              id: dataSelected.masteritemcategory?.masteritemcategory_id ?? "-",
              label:
                dataSelected.masteritemcategory
                  ?.masteritemcategory_description ?? "-",
            });
            continue;
          }
          if (key === "item_brand") {
            if (!dataSelected.item_brand) continue;
            setValue("item_brand", {
              id: dataSelected.item_brand.masterother_id ?? "-",
              label: dataSelected.item_brand.masterother_description ?? "-",
            });
            continue;
          }
          if (key === "item_tax") {
            if (!dataSelected.item_tax) continue;
            setValue("item_tax", {
              id: dataSelected.item_tax.masterother_id ?? "-",
              label: dataSelected.item_tax.masterother_description ?? "-",
            });
            continue;
          }
          if (key === "item_uom") {
            if (!dataSelected.item_uom) continue;
            setValue("item_uom", {
              id: dataSelected.item_uom.masterother_id ?? "-",
              label: dataSelected.item_uom.masterother_description ?? "-",
            });
            continue;
          }
          if (key === "multiple_uom") {
            const dataAppend = dataSelected[key]
              ?.filter((el) => el.masteritemuom_convertionqty > 1)
              .map((obj) => ({
                masteritemuom_convertionqty:
                  obj.masteritemuom_convertionqty ?? 0,
                masteritemuom_barcode: obj.masteritemuom_barcode ?? "",
                item_uom: {
                  id: obj.itemuom_uom?.masterother_id ?? "-",
                  label: obj.itemuom_uom?.masterother_description ?? "-",
                },
              }));
            if (!dataAppend) continue;
            if (dataAppend.length > 0) {
              setValue("isMultipleUnit", true);
            }
            setValue("multiple_uom", dataAppend);
            continue;
          }
          if (key === "masteritem_isvariant") {
            setValue("isVariant", dataSelected[key] === "Y");
            continue;
          }
          if (key === "item_variant") {
            const dataVariants: VariantResultType[] = (
              dataSelected[key]?.map(
                (variant) =>
                  variant.multiple_uom?.map((element) => ({
                    id: element.masteritemuom_id,
                    unit: {
                      id: element.masteruom_id,
                      label:
                        element.itemuom_uom?.masterother_description ?? "-",
                      convertionqty: element.masteritemuom_convertionqty,
                      barcode: element.masteritemuom_barcode,
                    },
                    description:
                      variant.masteritem_description.split(
                        `${dataSelected.masteritem_description}-`,
                      )?.[1] ?? "-",
                    barcode: element.masteritemuom_barcode ?? "",
                    price: variant.masteritem_priceinputdefault,
                  })) ?? [],
              ) ?? []
            ).flat();
            setValue("variants", dataVariants);
            // setTempVariants(dataVariants);
            continue;
          }

          setValue(
            key as keyof Partial<MasterItemBodyType>,
            dataSelected[
              key as keyof Pick<
                MasterItemBodyType,
                | "masteritem_qtysellmin"
                | "masteritem_qtysellmax"
                | "masteritem_priceinputdefault"
                | "masteritem_description"
                | "masteritem_alias"
                | "masteritem_catatan"
                | "masteritem_barcode"
                | "masteritem_isserialbatch"
                | "masteritem_stockmin"
                | "masteritem_stockmax"
                | "masteritem_oleh"
                | "masteritem_active"
              >
            ],
          );
        }
      }
    }
  }, [dataSelected, setValue]);

  useEffect(() => {
    if (dataCategory) {
      setValue(
        "stock",
        dataCategory.masteritemtype?.masteritemtype_isstock ?? false,
      );
      setValue(
        "sales",
        dataCategory.masteritemtype?.masteritemtype_issold ?? false,
      );
      setValue(
        "purchase",
        dataCategory.masteritemtype?.masteritemtype_ispurchase ?? false,
      );
      setValue(
        "assembly",
        dataCategory.masteritemtype?.masteritemtype_isassembly ?? false,
      );
      setValue(
        "disassembly",
        dataCategory.masteritemtype?.masteritemtype_isdissassembly ?? false,
      );
      setValue(
        "transfer",
        dataCategory.masteritemtype?.masteritemtype_istransfer ?? false,
      );
      setValue(
        "beginBalance",
        dataCategory.masteritemtype?.masteritemtype_isbeginbalance ?? false,
      );
      setValue(
        "adjust",
        dataCategory.masteritemtype?.masteritemtype_isadjustment ?? false,
      );
      setValue(
        "formula",
        dataCategory.masteritemtype?.masteritemtype_isformula ?? false,
      );
      setValue(
        "material",
        dataCategory.masteritemtype?.masteritemtype_iscomponent ?? false,
      );
      setValue(
        "modify",
        dataCategory.masteritemtype?.masteritemtype_ismodifier ?? false,
      );
    }
  }, [dataCategory, setValue]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFetchingSelected}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="mb-2 flex items-center gap-2">
        <Link href="/masters/products/items">
          <IconButton>
            <Close />
          </IconButton>
        </Link>
        <Typography variant="h6">Master Item</Typography>
      </div>
      <FormContainer formContext={formContext} onSuccess={onSubmit}>
        <div className="grid gap-4">
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <TextFieldElement
              name="masteritem_description"
              label="Code"
              required
            />
            <TextFieldElement
              name="masteritem_alias"
              label="Description"
              required
            />
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <AutocompleteMasterItemCategory
              name="masteritemcategory"
              label="Item Category"
              required
            />
            <Box className="col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <CheckboxElement disabled label="Stock" name="stock" />
              <CheckboxElement disabled label="Sales" name="sales" />
              <CheckboxElement disabled label="Purchase" name="purchase" />
              <CheckboxElement disabled label="Assembly" name="assembly" />
              <CheckboxElement
                disabled
                label="Disassembly"
                name="disassembly"
              />
              <CheckboxElement disabled label="Transfer" name="transfer" />
              <CheckboxElement
                disabled
                label="Begin. Balance"
                name="beginBalance"
              />
              <CheckboxElement disabled label="Adjust" name="adjust" />
              <CheckboxElement disabled label="Formula" name="formula" />
              <CheckboxElement disabled label="Material" name="material" />
              <CheckboxElement disabled label="Modify" name="modify" />
            </Box>
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <AutocompleteMasterOther
              name="item_uom"
              label="Unit of measurement"
              required
              type="uom"
              textFieldProps={{
                onBlur: handleRenderVariants,
              }}
            />
            <AutocompleteMasterOther
              name="item_tax"
              label="Tax"
              required
              type="tax"
            />
            <RadioButtonGroup
              label="Serial/ Batch"
              name="masteritem_isserialbatch"
              options={[
                {
                  id: "N",
                  label: "No",
                },
                {
                  id: "S",
                  label: "Serialize",
                },
                {
                  id: "B",
                  label: "Batch",
                },
              ]}
              row
              required
            />
            <AutocompleteMasterOther
              name="item_brand"
              label="Brand"
              type="brand"
            />
            <TextFieldElement name="masteritem_barcode" label="Barcode" />
            <TextFieldElement
              name="masteritem_priceinputdefault"
              label="Default Price"
              InputProps={{
                inputComponent: NumericFormatCustom as never,
              }}
            />
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <TextFieldElement
              name="masteritem_stockmin"
              label="Minimum Stock"
              InputProps={{
                inputComponent: NumericFormatCustom as never,
              }}
            />
            <TextFieldElement
              name="masteritem_stockmax"
              label="Maximum Stock"
              InputProps={{
                inputComponent: NumericFormatCustom as never,
              }}
            />
            <TextFieldElement
              name="masteritem_qtysellmin"
              label="Minimum Sales Qty"
              className="col-start-1"
              InputProps={{
                inputComponent: NumericFormatCustom as never,
              }}
            />
            <TextFieldElement
              name="masteritem_qtysellmax"
              label="Maximum Sales Qty"
              InputProps={{
                inputComponent: NumericFormatCustom as never,
              }}
            />
            <TextareaAutosizeElement
              name="masteritem_catatan"
              label="Note"
              rows={3}
              className="col-start-1"
            />
            <SwitchElement name="masteritem_active" label="Active" />
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <CheckboxElement label="Multi Satuan?" name="isMultipleUnit" />
            <Collapse in={isMultipleUnit} className="col-span-3 col-start-1">
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
                      <TableCell width="35%">Unit</TableCell>
                      <TableCell width="15%" align="right">
                        Qty
                      </TableCell>
                      <TableCell width="5%">Base</TableCell>
                      <TableCell width="25%">Barcode</TableCell>
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
                          <AutocompleteMasterOther
                            name={`multiple_uom.${index}.item_uom`}
                            required
                            type="uom"
                            autocompleteProps={{
                              size: "small",
                            }}
                            textFieldProps={{
                              hiddenLabel: true,
                              onBlur: handleRenderVariants,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextFieldElement
                            name={`multiple_uom.${index}.masteritemuom_convertionqty`}
                            hiddenLabel
                            InputProps={{
                              inputComponent: NumericFormatCustom as never,
                              onBlur: handleRenderVariants,
                            }}
                            fullWidth
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{selectedUnitBase?.label ?? "-"}</TableCell>
                        <TableCell>
                          <TextFieldElement
                            name={`multiple_uom.${index}.masteritemuom_barcode`}
                            hiddenLabel
                            fullWidth
                            size="small"
                            InputProps={{
                              onBlur: handleRenderVariants,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => void removeUnit(index)}
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
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Button
                          startIcon={<Add />}
                          onClick={() =>
                            void appendUnit({
                              item_uom: null,
                              masteritemuom_convertionqty: 0,
                              masteritemuom_barcode: "",
                            })
                          }
                          size="large"
                          fullWidth
                        >
                          Add New
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Collapse>
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <CheckboxElement label="Have Variant?" name="isVariant" />
            <Collapse
              in={watch("isVariant")}
              className="col-span-3 col-start-1"
            >
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
                      <TableCell width="20%">Variant</TableCell>
                      <TableCell width="70%">Values</TableCell>
                      <TableCell width="5%" align="center">
                        <Delete />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fieldsVariantCategory.map((row, index) => (
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
                          <TextFieldElement
                            name={`variantCategories.${index}.name`}
                            hiddenLabel
                            fullWidth
                            size="small"
                            required
                          />
                        </TableCell>
                        <TableCell>
                          <AutocompleteElement
                            options={[]}
                            required
                            multiple
                            name={`variantCategories.${index}.values`}
                            textFieldProps={{
                              hiddenLabel: true,
                              // onBlur: handleRenderVariants,
                            }}
                            autocompleteProps={{
                              size: "small",
                              noOptionsText: "Type your own variants",
                              freeSolo: true,
                              onChange: (_, value: string[]) => {
                                setValue(`variantCategories.${index}.values`, [
                                  ...new Set(value),
                                ]);
                                handleRenderVariants();
                              },
                              renderTags: (
                                value: readonly string[],
                                getTagProps,
                              ) =>
                                value.map((option: string, index: number) => (
                                  // eslint-disable-next-line react/jsx-key
                                  <Chip
                                    variant="filled"
                                    label={option}
                                    size="small"
                                    {...getTagProps({ index })}
                                  />
                                )),
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => void removeVariantCategory(index)}
                            color="error"
                            size="small"
                          >
                            <Close />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  {fieldsVariantCategory.length < 3 && (
                    <TableFooter>
                      <TableRow>
                        <TableCell colSpan={4}>
                          <Button
                            startIcon={<Add />}
                            onClick={() =>
                              void appendVariantCategory({
                                name: "",
                                values: [],
                              })
                            }
                            size="large"
                            fullWidth
                          >
                            Add New
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  )}
                </Table>
              </TableContainer>
            </Collapse>
          </Box>
          {fieldsVariant.length > 0 && (
            <Box component={Paper} className="p-4">
              <Typography gutterBottom>Variant Results:</Typography>
              <TableContainer
                component={Paper}
                elevation={0}
                variant="outlined"
                sx={{ maxHeight: 340 }}
              >
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell width="5%" align="right">
                        No
                      </TableCell>
                      <TableCell width="45%">Variant</TableCell>
                      <TableCell width="10%">Unit</TableCell>
                      <TableCell width="20%">Barcode</TableCell>
                      <TableCell width="20%">Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fieldsVariant.map((row, index) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row" align="right">
                          {index + 1}
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.unit.label}</TableCell>
                        <TableCell>
                          <TextFieldElement
                            name={`variants.${index}.barcode`}
                            hiddenLabel
                            fullWidth
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {row.unit.convertionqty === 1 && (
                            <TextFieldElement
                              name={`variants.${index}.price`}
                              hiddenLabel
                              fullWidth
                              size="small"
                              InputProps={{
                                inputComponent: NumericFormatCustom as never,
                              }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <Box className="flex flex-col justify-between md:flex-row">
            <div></div>
            <div>
              <Button
                variant="contained"
                type="submit"
                disabled={isSubmitting}
                fullWidth
              >
                Save
              </Button>
            </div>
          </Box>
        </div>
      </FormContainer>
    </>
  );
};

export default MasterItemView;
