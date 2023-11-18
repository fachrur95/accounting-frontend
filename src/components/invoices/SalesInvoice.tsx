import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useRef, useState } from "react";
import Close from "@mui/icons-material/Close";
import Print from "@mui/icons-material/Print";
import { api } from "@/utils/api";
import Link from "next/link";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useReactToPrint } from "react-to-print";
import useSessionData from "../hooks/useSessionData";
import { dateConvertID, formatNumber } from "@/utils/helpers";
import Divider from "@mui/material/Divider";
import { PaymentType } from "@/types/prisma-api/payment-type.d";

// import useNotification from "@/components/hooks/useNotification";

interface ISalesInvoice {
  id: string;
  showIn: "popup" | "page";
}

const basePath = "/sales";

type TotalType = {
  subTotal: number;
  total: number;
  totalDiscountDetail: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  balance: number;
};

const SalesInvoice = (props: ISalesInvoice) => {
  const { id, showIn } = props;
  const { data: sessionData } = useSessionData();
  const componentRef = useRef<HTMLDivElement | null>(null);
  const [total, setTotal] = useState<TotalType>({
    subTotal: 0,
    total: 0,
    totalDiscountDetail: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
    balance: 0,
  });
  // const formContext = useForm<IUnitMutation>({ defaultValues });
  // const { setOpenNotification } = useNotification();

  const { data: dataSelected, isFetching: isFetchingSelected } =
    api.globalTransaction.findOne.useQuery(
      { id },
      { enabled: !!id, refetchOnWindowFocus: false, refetchOnReconnect: false },
    );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (dataSelected) {
      const specialDiscount = dataSelected.specialDiscount;
      const discountGroupInput = dataSelected.discountGroupInput;
      const paymentInput = dataSelected.paymentInput;
      const transactionDetails = dataSelected.transactionDetails;
      if (transactionDetails) {
        const sumTotal = transactionDetails.reduce<
          Omit<TotalType, "grandTotal" | "balance" | "totalDiscount">
        >(
          (obj, detail) => {
            const qty =
              detail.qtyInput * (detail.multipleUom?.conversionQty ?? 0);
            const subTotal = qty * detail.priceInput;
            const total = qty * (detail.priceInput - detail.discountInput);
            const totalDiscountDetail = qty * detail.discountInput;

            obj.subTotal += subTotal;
            obj.totalDiscountDetail += totalDiscountDetail;
            obj.total += total;
            return obj;
          },
          { subTotal: 0, totalDiscountDetail: 0, totalTax: 0, total: 0 },
        );
        const total = sumTotal.total;
        const specialDiscountValue = (specialDiscount / 100) * total;
        const additionalDiscount = discountGroupInput + specialDiscountValue;
        const grandTotal = total - additionalDiscount;
        const balance = grandTotal - paymentInput;
        const totalDiscount = sumTotal.totalDiscountDetail + additionalDiscount;
        setTotal({ ...sumTotal, totalDiscount, grandTotal, balance });
      }
    }
  }, [dataSelected]);

  if (!dataSelected) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

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
            <Typography variant="h6">Nota Penjualan</Typography>
          </div>
          <div>
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              startIcon={<Print />}
              onClick={handlePrint}
            >
              Cetak
            </Button>
          </div>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component={Paper} className="flex items-center justify-center p-4">
          <Box
            ref={componentRef}
            className="max-w-full md:max-w-md"
            // style={{ fontFamily: "Courier" }}
          >
            <Box className="mb-5">
              <Typography variant="h6" className="font-print font-bold">
                {sessionData?.session?.unit?.name ?? ""}
              </Typography>
            </Box>
            <Box className="flex flex-col gap-2">
              <Typography className="font-print text-xs md:text-sm">
                {dateConvertID(new Date(dataSelected.entryDate), {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </Typography>
              <Divider
                variant="middle"
                component="hr"
                className="border-dashed"
              />
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  No. Nota
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {dataSelected.transactionNumber}
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Kode
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {dataSelected.people?.code ?? "-"}
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Pelanggan
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {dataSelected.people?.name ?? "-"}
                </Typography>
              </Box>

              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Bayar
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {dataSelected.paymentType === PaymentType.CASH
                    ? "TUNAI"
                    : "NON-TUNAI"}
                </Typography>
              </Box>
              {dataSelected.paymentType === PaymentType.CASHLESS && (
                <Box className="flex flex-row flex-wrap items-center justify-between">
                  <Typography className="font-print text-xs md:text-sm">
                    Sumber
                  </Typography>
                  <Typography className="font-print text-xs font-bold md:text-sm">
                    {dataSelected.chartOfAccount?.name ?? "-"}
                  </Typography>
                </Box>
              )}
              <Divider
                variant="middle"
                component="hr"
                className="border-dashed"
              />
              {dataSelected.transactionDetails?.map((detail) => (
                <Box
                  key={detail.id}
                  className="flex flex-row flex-wrap items-center justify-between"
                >
                  <Typography className="font-print text-xs md:text-sm">
                    {detail.multipleUom?.item?.name ?? "-"}
                  </Typography>
                  <Typography className="font-print text-xs md:text-sm">
                    {detail.qtyInput}{" "}
                    {detail.multipleUom?.unitOfMeasure?.code ??
                      detail.multipleUom?.unitOfMeasure?.name ??
                      ""}
                  </Typography>
                  <Typography className="font-print text-xs font-bold md:text-sm">
                    {formatNumber(detail.priceInput)}
                  </Typography>
                </Box>
              ))}
              <Divider
                variant="middle"
                component="hr"
                className="border-dashed"
              />
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Sub Total
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {formatNumber(total.subTotal)}
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Total Diskon
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {formatNumber(total.totalDiscount)}
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Total Akhir
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {formatNumber(total.grandTotal)}
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Pembayaran
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {formatNumber(dataSelected.paymentInput)}
                </Typography>
              </Box>
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Kembali
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {formatNumber(dataSelected.change)}
                </Typography>
              </Box>
              <Divider
                variant="middle"
                component="hr"
                className="border-dashed"
              />
              <Box className="flex flex-row flex-wrap items-center justify-between">
                <Typography className="font-print text-xs md:text-sm">
                  Operator
                </Typography>
                <Typography className="font-print text-xs font-bold md:text-sm">
                  {dataSelected.createdBy ?? "-"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};

export default SalesInvoice;
