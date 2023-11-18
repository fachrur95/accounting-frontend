import useNotification from "@/components/hooks/useNotification";
import type { FormSlugType } from "@/types/global";
import type { IImage } from "@/types/prisma-api/image";
import type { IDataOption } from "@/types/options";
import type {
  IItemMutation,
  IMultipleUomMutation,
} from "@/types/prisma-api/item";
import { api } from "@/utils/api";
import Add from "@mui/icons-material/Add";
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
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { resizeFile } from "@/utils/helpersWithLibs";
import { imageUrlToFile } from "@/utils/helpers";
import {
  FormContainer,
  SwitchElement,
  TextFieldElement,
  TextareaAutosizeElement,
  useFieldArray,
  useForm,
} from "react-hook-form-mui";
import NumericFormatCustom from "../controls/NumericFormatCustom";
import AutocompleteItemCategory from "../controls/autocompletes/masters/AutocompleteItemCategory";
import AutocompleteUnitOfMeasure from "../controls/autocompletes/masters/AutocompleteUnitOfMeasure";

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
  price: 0,
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
  const [files, setFile] = useState<File[]>([]);
  const [imagesUploaded, setImagesUploaded] = useState<IImage[]>([]);
  // const [defaultUnit, setDefaultUnit] = useState<string | null>(null);
  const formContext = useForm<IItemMutation>({ defaultValues });
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
    name: "multipleUoms",
  });
  const defaultUnit: IMultipleUomMutation[] = watch("multipleUoms");

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.item.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const { getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFile((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
    accept: {
      "image/jpeg": [],
      "image/jpg": [],
      "image/png": [],
      "image/webp": [],
    },
  });

  const removeImage = (i: string) => {
    setFile(files.filter((x) => x?.name !== i));
  };

  const removeImageUploaded = (i: string) => {
    setImagesUploaded(imagesUploaded.filter((x) => x.id !== i));
  };

  const mutationCreate = api.item.create.useMutation({
    onSuccess: () => void router.push("/masters/products"),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
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
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
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

  const onSubmit = async (data: IItemMutation) => {
    if (isSubmitting) {
      return;
    }
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

    const fileBlob: string[] = [];

    for (const file of files) {
      // const blobed = await fileToBase64(file);
      const blobed = await resizeFile(file);
      fileBlob.push(JSON.stringify(blobed));
    }
    const dataSave = {
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
      files: fileBlob,
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
          if (key === "images") {
            const images = dataSelected[key]!;
            if (images && images.length > 0) {
              const getImages = async () => {
                const filesImage: File[] = [];
                for (const [index, image] of images.entries()) {
                  const converted: File | null = await imageUrlToFile(
                    image.imageUrl,
                    `image-${index}.webp`,
                  );
                  if (converted instanceof File) {
                    filesImage.push(converted);
                  }
                }
                return filesImage;
              };

              Promise.all([getImages()])
                .then(([imageResult]) => {
                  // Kedua proses telah selesai dijalankan
                  setFile(imageResult);
                })
                .catch((error) => {
                  console.error("Terjadi kesalahan:", error);
                });
            }
            continue;
          }
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
            const selectedTax = dataSelected[key]!;
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

          if (
            key === "itemCategoryId" ||
            key === "taxId" ||
            key === "code" ||
            key === "name" ||
            key === "description" ||
            key === "minQty" ||
            key === "maxQty" ||
            key === "manualCogs" ||
            key === "price" ||
            key === "note" ||
            key === "isActive"
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
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextFieldElement
                name="code"
                label="Kode"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
                autoFocus
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
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextFieldElement
                name="manualCogs"
                label="HPP Manual (diisi jika pengaturan manual)"
                InputProps={{
                  inputComponent: NumericFormatCustom as never,
                  disabled: mode === "view",
                }}
              />
              <TextFieldElement
                name="price"
                label="Harga Jual Satuan"
                InputProps={{
                  inputComponent: NumericFormatCustom as never,
                  disabled: mode === "view",
                }}
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
                            width: "30%",
                            minWidth: { xs: 250, md: "auto" },
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
                          Qty
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "15%",
                            minWidth: { xs: 150, md: "auto" },
                          }}
                        >
                          Satuan Dasar
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "20%",
                            minWidth: { xs: 250, md: "auto" },
                          }}
                        >
                          Barcode
                        </TableCell>
                        <TableCell
                          sx={{
                            width: "5%",
                            minWidth: { xs: 100, md: "auto" },
                          }}
                          align="center"
                        >
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
                            <AutocompleteUnitOfMeasure
                              name={`multipleUoms.${index}.unitOfMeasure`}
                              required
                              autocompleteProps={{
                                size: "small",
                                disabled: mode === "view",
                                /* onChange: (_, data) => {
                                  if (index === 0) {
                                    setDefaultUnit(
                                      (data as IDataOption | null)?.label ??
                                        null,
                                    );
                                  }
                                }, */
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
                          {/* <TableCell>{defaultUnit ?? "-"}</TableCell> */}
                          {/* <TableCell>
                            {fields[0]?.unitOfMeasure?.label ?? "-"}
                          </TableCell> */}
                          <TableCell>
                            {(
                              defaultUnit?.[0]
                                ?.unitOfMeasure as IDataOption | null
                            )?.label ?? "-"}
                          </TableCell>
                          <TableCell>
                            <TextFieldElement
                              name={`multipleUoms.${index}.barcode`}
                              hiddenLabel
                              InputProps={{
                                disabled: mode === "view",
                              }}
                              fullWidth
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => void remove(index)}
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
                                void append({
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
            <Box component={Paper}>
              <div className="flex items-center justify-center">
                <div className="w-full rounded-lg shadow-xl">
                  <div className="m-4 rounded-md border-2 border-dashed p-4">
                    {mode !== "view" && (
                      <div className="flex w-full items-center justify-center">
                        <label className="flex h-auto w-full cursor-pointer flex-col">
                          <div className="flex flex-col items-center justify-center pt-7">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-gray-400 group-hover:text-gray-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                              Pilih Gambar
                            </p>
                          </div>
                          <input {...getInputProps()} className="opacity-0" />
                        </label>
                      </div>
                    )}
                    {/* <Typography variant="caption" color="error">
                      {errors?.images}
                    </Typography> */}
                    {(files.length > 0 || imagesUploaded.length > 0) && (
                      <div>
                        <Typography variant="caption">
                          Selected Images
                        </Typography>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {imagesUploaded.map((image, key) => (
                            <div key={key} className="relative overflow-hidden">
                              {mode !== "view" && (
                                <IconButton
                                  onClick={() => {
                                    removeImageUploaded(image.id);
                                  }}
                                  className="absolute right-1 cursor-pointer transition-all duration-300 hover:text-red-500"
                                  size="small"
                                  color="error"
                                >
                                  <Close fontSize="small" />
                                </IconButton>
                              )}
                              <Image
                                height={100}
                                width={100}
                                // alt={image?.label ?? "No label"}
                                alt={"No label"}
                                // className="rounded-md"
                                className="h-20 w-20 rounded-md"
                                src={image.imageUrl}
                              />
                            </div>
                          ))}
                          {files.map((file, key) => (
                            <div key={key} className="relative overflow-hidden">
                              {mode !== "view" && (
                                <IconButton
                                  onClick={() => {
                                    removeImage(file.name);
                                  }}
                                  className="absolute right-1 cursor-pointer transition-all duration-300 hover:text-red-500"
                                  size="small"
                                  color="error"
                                >
                                  <Close fontSize="small" />
                                </IconButton>
                              )}
                              <Image
                                height={100}
                                width={100}
                                alt={file.name}
                                // className="rounded-md"
                                className="h-20 w-20 rounded-md"
                                src={URL.createObjectURL(file)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* {imagesUploaded.length > 0 && (
                      <div>
                        <Typography variant="caption">
                          Uploaded Images
                        </Typography>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {imagesUploaded.map((image, key) => (
                            <div key={key} className="relative overflow-hidden">
                              <IconButton
                                onClick={() => {
                                  removeImageUploaded(image.id);
                                }}
                                className="absolute right-1 cursor-pointer transition-all duration-300 hover:text-red-500"
                                size="small"
                              >
                                <Close fontSize="small" />
                              </IconButton>
                              <Image
                                height={100}
                                width={100}
                                // alt={image?.label ?? "No label"}
                                alt={"No label"}
                                // className="rounded-md"
                                className="h-20 w-20 rounded-md"
                                src={image.imageUrl}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
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

export default MasterItemForm;
