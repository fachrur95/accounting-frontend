import type { IDataOption } from "@/types/options";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TableFooter,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FormContainer,
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
import AutocompleteItemCategory from "../controls/autocompletes/masters/AutocompleteItemCategory";
import AutocompleteTax from "../controls/autocompletes/masters/AutocompleteTax";
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
import type { IItemCategory } from "@/types/prisma-api/item-category";
import type { ITax } from "@/types/prisma-api/tax";

type MasterItemBodyType = IItemMutation & {
  itemCategory: IDataOption | IItemCategory | null;
  tax: IDataOption | ITax | null;
};

const defaultValues: MasterItemBodyType = {
  itemCategory: null,
  tax: null,
  itemCategoryId: "",
  taxId: "",
  code: "",
  name: "",
  description: "",
  minQty: 0,
  maxQty: 0,
  note: "",
  isActive: true,
  multipleUoms: [],
  files: [],
};

interface IMasterItemForm {
  slug: FormSlugType;
}

const MasterItemForm = (props: IMasterItemForm) => {
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<MasterItemBodyType>({ defaultValues });
  const { slug } = props;

  console.log({ mode });

  const {
    control,
    setValue,
    // getValues,
    formState: { isSubmitting },
    // reset,
    // setError,
    // watch,
  } = formContext;

  const {
    fields: fieldsUnit,
    append: appendUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: "multipleUoms",
  });

  // const selectedCategory = watch("itemCategory");
  // const currentVariantCategory = watch("variantCategories");
  // const currentVariants = watch("variants");

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.item.findOne.useQuery(
      { id: selectedId ?? "" },
      { enabled: !!selectedId, refetchOnWindowFocus: false },
    );

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
      for (const key in dataSelected) {
        if (Object.prototype.hasOwnProperty.call(dataSelected, key)) {
          if (
            key === "itemCategory" ||
            key === "multipleUoms" ||
            key === "tax" ||
            key === "files"
          ) {
            continue;
          }
          setValue(
            key as keyof Partial<MasterItemBodyType>,
            dataSelected[
              key as keyof Omit<
                MasterItemBodyType,
                "itemCategory" | "multipleUoms" | "tax" | "files"
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
            <TextFieldElement name="code" label="Kode" required />
            <TextFieldElement name="name" label="Nama Produk" required />
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <AutocompleteItemCategory
              name="itemCategory"
              label="Kategori Produk"
              required
            />
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <TextFieldElement
              name="minQty"
              label="Minimum Stock"
              InputProps={{
                inputComponent: NumericFormatCustom as never,
              }}
            />
            <TextFieldElement
              name="maxQty"
              label="Maximum Stock"
              InputProps={{
                inputComponent: NumericFormatCustom as never,
              }}
            />
            <TextareaAutosizeElement
              name="note"
              label="Catatan"
              rows={3}
              className="col-start-1"
            />
            <SwitchElement name="masteritem_active" label="Active" />
          </Box>
          <Box
            component={Paper}
            className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
          >
            <TableContainer component={Paper} elevation={0} variant="outlined">
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
                        <AutocompleteTax
                          name={`multipleUoms.${index}.unitOfMeasure`}
                          required
                          autocompleteProps={{
                            size: "small",
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
                          }}
                          fullWidth
                          size="small"
                        />
                      </TableCell>
                      <TableCell>XX</TableCell>
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
                            unitOfMeasure: null,
                            conversionQty: 0,
                            barcode: "",
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
          </Box>
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

export default MasterItemForm;
