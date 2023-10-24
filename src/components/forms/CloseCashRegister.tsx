import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import Close from "@mui/icons-material/Close";
import Save from "@mui/icons-material/Save";
import { api } from "@/utils/api";
import Link from "next/link";
// import type { FormSlugType } from "@/types/global";
import type { ICloseCashRegisterMutation } from "@/types/prisma-api/cash-register";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useRouter } from "next/router";
import useNotification from "@/components/hooks/useNotification";
import NumericFormatCustom from "../controls/NumericFormatCustom";
import ModalTransition from "@/components/dialogs/ModalTransition";
import { formatCurrency } from "@/utils/helpers";

const defaultValues: ICloseCashRegisterMutation = {
  transactionNumber: "",
  amount: 0,
};

interface ICloseCashRegisterForm {
  open: boolean;
  setClose: () => void;
}

const basePath = "/sales";

const CloseCashRegisterForm = (props: ICloseCashRegisterForm) => {
  const { open, setClose } = props;
  const router = useRouter();
  const formContext = useForm<ICloseCashRegisterMutation>({ defaultValues });
  const { setOpenNotification } = useNotification();

  const {
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataNumber } = api.globalTransaction.generateNumber.useQuery({
    transactionType: "CLOSE_REGISTER",
  });

  const { data: dataLastBalance } = api.cashRegister.getLastBalance.useQuery();
  console.log({ dataLastBalance });

  const mutation = api.cashRegister.close.useMutation({
    onSuccess: () => {
      setClose();
      void router.push(basePath);
    },
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(field as keyof ICloseCashRegisterMutation, {
            type: "custom",
            message: errors[field]?.join(", "),
          });
        }
      }
    },
  });

  const onSubmit = (data: ICloseCashRegisterMutation) => {
    return void mutation.mutate(data);
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
              <Typography variant="h6">Tutupan Kasir</Typography>
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
              <Box component={Paper} variant="outlined" className="p-4">
                <TextFieldElement
                  name="transactionNumber"
                  label="No. Transaksi"
                  required
                  fullWidth
                />
              </Box>
              <Box
                component={Paper}
                variant="outlined"
                className="flex flex-col gap-2 p-4"
              >
                <Typography variant="body2" align="right">
                  Saldo Akhir Seharusnya:{" "}
                  {formatCurrency(dataLastBalance?.balance ?? 0)}
                </Typography>
                <TextFieldElement
                  name="amount"
                  label="Saldo Akhir Kasir"
                  InputProps={{
                    inputComponent: NumericFormatCustom as never,
                  }}
                  fullWidth
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

export default CloseCashRegisterForm;
