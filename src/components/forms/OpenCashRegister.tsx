import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import Close from "@mui/icons-material/Close";
import Save from "@mui/icons-material/Save";
import { api } from "@/utils/api";
import Link from "next/link";
// import type { FormSlugType } from "@/types/global";
import type { IOpenCashRegisterMutation } from "@/types/prisma-api/cash-register";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
import NumericFormatCustom from "../controls/NumericFormatCustom";
import ModalTransition from "@/components/dialogs/ModalTransition";
import PointOfSale from "@mui/icons-material/PointOfSale";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const defaultValues: IOpenCashRegisterMutation = {
  transactionNumber: "",
  cashRegisterId: "",
  cashRegister: null,
  amount: 0,
};

interface IOpenCashRegisterForm {
  open: boolean;
  setClose: () => void;
}

const basePath = "/sales/f";

const OpenCashRegisterForm = (props: IOpenCashRegisterForm) => {
  const { open, setClose } = props;
  const router = useRouter();
  const formContext = useForm<IOpenCashRegisterMutation>({ defaultValues });
  const [cashRegisterSelected, setCashRegisterSelected] = useState<
    string | null
  >(null);
  const { setOpenNotification } = useNotification();

  const {
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: "OPEN_REGISTER",
  });

  const { data: dataCashRegisters } = api.cashRegister.getAllStatus.useQuery();

  const handleCashRegisterSelected = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setCashRegisterSelected(newAlignment);
  };

  const mutation = api.cashRegister.open.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof IOpenCashRegisterMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: IOpenCashRegisterMutation) => {
    if (!cashRegisterSelected) {
      return setOpenNotification("Pilih Mesin Kasir");
    }
    return void mutation.mutate({
      ...data,
      cashRegisterId: cashRegisterSelected,
    });
  };

  useEffect(() => {
    if (dataNumber) {
      setValue("transactionNumber", dataNumber.transactionNumber);
    }
  }, [dataNumber, setValue]);

  return (
    <>
      <ModalTransition
        open={open}
        handleClose={setClose}
        maxWidth="sm"
        fullWidth
        scroll="paper"
      >
        {/* component={showIn === "page" ? Paper : undefined} */}
        <DialogTitle>
          <Box
            // component={showIn === "page" ? Paper : undefined}
            className={`flex items-center justify-between`}
          >
            <div className="mb-2 flex items-center gap-2">
              <Link href={basePath}>
                <IconButton color="error">
                  <Close />
                </IconButton>
              </Link>
              <Typography variant="h6">Bukaan Kasir</Typography>
            </div>
            <div>
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
            </div>
          </Box>
        </DialogTitle>
        <DialogContent>
          <FormContainer formContext={formContext} onSuccess={onSubmit}>
            <div className="grid gap-4">
              <Box component={Paper} className="p-4">
                <TextFieldElement
                  name="transactionNumber"
                  label="No. Transaksi"
                  required
                  fullWidth
                />
              </Box>
              <Box
                component={Paper}
                className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
              >
                {/* {dataCashRegisters && dataCashRegisters.map((cashRegister) => ())} */}
                <Box className="col-span-3 w-full">
                  <Typography variant="body2">Pilih Mesin Kasir</Typography>
                  <ToggleButtonGroup
                    value={cashRegisterSelected}
                    exclusive
                    onChange={handleCashRegisterSelected}
                    aria-label="cash register"
                  >
                    {dataCashRegisters?.map((cashRegister) => (
                      <ToggleButton
                        key={cashRegister.id}
                        value={cashRegister.id}
                        aria-label={cashRegister.name}
                        disabled={cashRegister.status === false}
                      >
                        <Box className="flex flex-col items-center gap-2">
                          <PointOfSale />
                          <Typography variant="subtitle2">
                            {cashRegister.name}
                          </Typography>
                        </Box>
                      </ToggleButton>
                    ))}
                    {/* <ToggleButton value="left" aria-label="left aligned">
                      <FormatAlignLeftIcon />
                    </ToggleButton>
                    <ToggleButton value="center" aria-label="centered">
                      <FormatAlignCenterIcon />
                    </ToggleButton>
                    <ToggleButton value="right" aria-label="right aligned">
                      <FormatAlignRightIcon />
                    </ToggleButton>
                    <ToggleButton
                      value="justify"
                      aria-label="justified"
                      disabled
                    >
                      <FormatAlignJustifyIcon />
                    </ToggleButton> */}
                  </ToggleButtonGroup>
                </Box>
                <TextFieldElement
                  name="amount"
                  label="Saldo Awal Kasir"
                  InputProps={{
                    inputComponent: NumericFormatCustom as never,
                  }}
                  className="col-span-2"
                />
              </Box>
              <Button type="submit" disabled={isSubmitting} className="hidden">
                Simpan
              </Button>
            </div>
          </FormContainer>
        </DialogContent>
      </ModalTransition>
    </>
  );
};

export default OpenCashRegisterForm;
