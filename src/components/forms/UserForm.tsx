import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import {
  FormContainer,
  TextFieldElement,
  RadioButtonGroup,
  PasswordElement,
  PasswordRepeatElement,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form-mui";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import Save from "@mui/icons-material/Save";
import { api } from "@/utils/api";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { FormSlugType } from "@/types/global";
import type { IUserMutation } from "@/types/prisma-api/user";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
import AutocompleteUnit from "../controls/autocompletes/masters/AutocompleteUnit";
import { Role } from "@/types/prisma-api/role.d";

const defaultValues: IUserMutation = {
  email: "",
  name: "",
  password: "",
  role: Role.USER,
  userUnits: [],
};

interface IUserForm {
  slug: FormSlugType;
  showIn: "popup" | "page";
}

const basePath = "/settings/users";

const UserForm = (props: IUserForm) => {
  const { slug, showIn } = props;
  const router = useRouter();
  const [mode, setMode] = useState<"create" | "update" | "view">("create");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formContext = useForm<IUserMutation>({ defaultValues });
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
    name: "userUnits",
  });

  const role = useWatch({ control, name: "role" });

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.user.findOne.useQuery(
      { id: selectedId ?? "" },
      {
        enabled: !!selectedId,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    );

  const mutationCreate = api.user.create.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IUserMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const mutationUpdate = api.user.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IUserMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IUserMutation) => {
    const dataSave = {
      ...data,
      userUnits:
        data.role !== Role.SUPERADMIN
          ? data.userUnits.map((unit) => ({
              ...unit,
              unitId: unit.unit?.id ?? "",
            }))
          : undefined,
    };
    if (selectedId) {
      return void mutationUpdate.mutate({
        ...dataSave,
        password:
          data.password === "" || !data.password ? undefined : data.password,
        id: selectedId,
      });
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
          if (key === "userUnits") {
            const userUnits = dataSelected[key]!;

            if (userUnits.length > 0) {
              const dataUnit = userUnits.map((unit) => {
                const selectedUnit = {
                  id: unit.unit?.id ?? "",
                  label: unit.unit?.name ?? "",
                };
                return {
                  id: unit.id,
                  unitId: selectedUnit.id,
                  unit: selectedUnit,
                };
              });
              setValue("userUnits", dataUnit);
            }

            continue;
          }
          if (key === "email" || key === "name" || key === "role") {
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
            <Typography variant="h6">Pengguna</Typography>
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
            <Box component={Paper} className="grid grid-cols-1 gap-4 p-4">
              <TextFieldElement
                name="email"
                label="Email"
                type="email"
                InputProps={{
                  disabled: mode === "view",
                }}
                autoFocus
              />
              <TextFieldElement
                name="name"
                label="Nama"
                required
                InputProps={{
                  disabled: mode === "view",
                }}
              />
              <PasswordElement
                label="Kata Sandi"
                required
                name="password"
                disabled={mode === "view"}
              />
              <PasswordRepeatElement
                passwordFieldName="password"
                name="password-repeat"
                label="Konfirmasi Kata Sandi"
                required
                disabled={mode === "view"}
              />
              <RadioButtonGroup
                label="Peran"
                name="role"
                required
                options={[
                  {
                    id: "USER",
                    label: "KASIR",
                  },
                  {
                    id: "ADMIN",
                    label: "ADMIN UNIT",
                  },
                  {
                    id: "AUDITOR",
                    label: "AUDITOR/ LEMBAGA",
                  },
                  {
                    id: "SUPERADMIN",
                    label: "SUPER ADMIN",
                  },
                ]}
                disabled={mode === "view"}
              />
            </Box>
            {role !== Role.SUPERADMIN && (
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
                            sx={{
                              width: "5%",
                              minWidth: { xs: 80, md: "auto" },
                            }}
                            align="right"
                          >
                            No
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "90%",
                              minWidth: { xs: 250, md: "auto" },
                            }}
                          >
                            Unit
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
                              <AutocompleteUnit
                                name={`userUnits.${index}.unit`}
                                required
                                autocompleteProps={{
                                  size: "small",
                                  disabled: mode === "view",
                                }}
                                textFieldProps={{
                                  hiddenLabel: true,
                                }}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                onClick={() => void remove(index)}
                                color="error"
                                size="small"
                                disabled={mode === "view"}
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
                                    unitId: "",
                                    unit: null,
                                  })
                                }
                                size="large"
                                fullWidth
                              >
                                Tambah Akses Unit
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      )}
                    </Table>
                  </TableContainer>
                </Box>
              </div>
            )}
            <Button type="submit" disabled={isSubmitting} className="hidden">
              Simpan
            </Button>
          </div>
        </FormContainer>
      </DialogContent>
    </>
  );
};

export default UserForm;
