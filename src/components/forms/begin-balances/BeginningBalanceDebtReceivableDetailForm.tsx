import DatePicker from "@/components/controls/DatePicker";
import useNotification from "@/components/hooks/useNotification";
import type { IBeginBalanceDebtReceivableDetailFormMutation } from "@/types/prisma-api/transaction";
import { api } from "@/utils/api";
import Close from "@mui/icons-material/Close";
import Save from "@mui/icons-material/Save";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
  FormContainer,
  TextFieldElement,
  TextareaAutosizeElement,
  useForm,
} from "react-hook-form-mui";
import NumericFormatCustom from "../../controls/NumericFormatCustom";
import AutocompleteChartOfAccount from "../../controls/autocompletes/masters/AutocompleteChartOfAccount";
import AutocompletePeople from "../../controls/autocompletes/masters/AutocompletePeople";

interface IBeginBalanceDebtReceivableForm {
  id: string;
  showIn: "popup" | "page";
  type: "debt" | "receivable";
}

const defaultValues: IBeginBalanceDebtReceivableDetailFormMutation = {
  entryDate: new Date(),
  transactionNumber: "",
  chartOfAccountId: "",
  chartOfAccount: null,
  peopleId: "",
  people: null,
  underPayment: 0,
  note: "",
};

const BeginningBalanceDebtReceivableDetailForm = (
  props: IBeginBalanceDebtReceivableForm,
) => {
  const { id, showIn, type } = props;
  const router = useRouter();
  const formContext = useForm<IBeginBalanceDebtReceivableDetailFormMutation>({
    defaultValues,
  });
  const { setOpenNotification } = useNotification();

  const basePath = `/other-transactions/beginning-balances/${type}s`;

  const {
    setValue,
    formState: { isSubmitting },
    handleSubmit,
    setError,
  } = formContext;

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.globalTransaction.findOne.useQuery(
      { id: id ?? "" },
      { enabled: !!id, refetchOnWindowFocus: false, refetchOnReconnect: false },
    );

  const mutationUpdate = api.beginBalanceDebtReceivable.update.useMutation({
    onSuccess: () => void router.push(basePath),
    onError: (error) => {
      if (error.message) {
        setOpenNotification(error.message, { variant: "error" });
      }
      const errors = error.data?.zodError?.fieldErrors;
      if (errors) {
        for (const field in errors) {
          void setError(
            field as keyof IBeginBalanceDebtReceivableDetailFormMutation,
            {
              type: "custom",
              message: errors[field]?.join(", "),
            },
          );
        }
      }
    },
  });

  const onSubmit = (data: IBeginBalanceDebtReceivableDetailFormMutation) => {
    const dataSave = {
      ...data,
      chartOfAccountId: data.chartOfAccount?.id ?? "",
      peopleId: data.people?.id ?? "",
      note: data.note === "" || data.note === null ? undefined : data.note,
    };
    console.log({ dataSave });
    return void mutationUpdate.mutate({ ...dataSave, id, type });
  };

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

          if (
            key === "transactionNumber" ||
            key === "chartOfAccountId" ||
            key === "peopleId" ||
            key === "underPayment" ||
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
        open={isSubmitting || isFetchingSelected}
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
            <Typography variant="h6">{`Saldo Awal ${
              type === "debt" ? "Hutang" : "Piutang"
            }`}</Typography>
          </div>
          <div>
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
              />
              <AutocompleteChartOfAccount
                name="chartOfAccount"
                label="Akun"
                required
              />
              <DatePicker label="Tanggal" name="entryDate" />
            </Box>
            <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <AutocompletePeople
                name="people"
                label={type === "debt" ? "Pemasok" : "Pelanggan"}
                required
                type={type === "debt" ? "supplier" : "customer"}
              />
              <TextFieldElement
                name="underPayment"
                label={type === "debt" ? "Hutang" : "Piutang"}
                InputProps={{
                  inputComponent: NumericFormatCustom as never,
                }}
                fullWidth
              />
            </Box>
            <Box
              component={Paper}
              className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
            >
              <TextareaAutosizeElement
                name="note"
                label="Catatan"
                rows={3}
                className="col-start-1"
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

export default BeginningBalanceDebtReceivableDetailForm;
