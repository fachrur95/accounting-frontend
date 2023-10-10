import AccountBalance from "@mui/icons-material/AccountBalance";
import AssignmentReturn from "@mui/icons-material/AssignmentReturn";
import AssignmentTurnedInOutlined from "@mui/icons-material/AssignmentTurnedInOutlined";
import BuildCircleOutlined from "@mui/icons-material/BuildCircleOutlined";
import CallMadeOutlined from "@mui/icons-material/CallMadeOutlined";
import CallMergeOutlined from "@mui/icons-material/CallMergeOutlined";
import CallReceivedOutlined from "@mui/icons-material/CallReceivedOutlined";
import CallSplitOutlined from "@mui/icons-material/CallSplitOutlined";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import CompareArrowsOutlined from "@mui/icons-material/CompareArrowsOutlined";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
import Factory from "@mui/icons-material/Factory";
import FormatListNumberedOutlined from "@mui/icons-material/FormatListNumberedOutlined";
import FormatQuote from "@mui/icons-material/FormatQuote";
import GroupAddOutlined from "@mui/icons-material/GroupAddOutlined";
import Hiking from "@mui/icons-material/Hiking";
import ImportExportOutlined from "@mui/icons-material/ImportExportOutlined";
import InsertChartOutlined from "@mui/icons-material/InsertChartOutlined";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import LocalActivityOutlined from "@mui/icons-material/LocalActivityOutlined";
import LocalAtmOutlined from "@mui/icons-material/LocalAtmOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import MenuBook from "@mui/icons-material/MenuBook";
import MonetizationOnOutlined from "@mui/icons-material/MonetizationOnOutlined";
import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import MoreOutlined from "@mui/icons-material/MoreOutlined";
import PaymentOutlined from "@mui/icons-material/PaymentOutlined";
import PriceChange from "@mui/icons-material/PriceChange";
import ProductionQuantityLimits from "@mui/icons-material/ProductionQuantityLimits";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import SaveAltOutlined from "@mui/icons-material/SaveAltOutlined";
import SettingsApplicationsOutlined from "@mui/icons-material/SettingsApplicationsOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import Undo from "@mui/icons-material/Undo";
import Groups from "@mui/icons-material/Groups";
import Diversity3 from "@mui/icons-material/Diversity3";
import Diversity2 from "@mui/icons-material/Diversity2";

export type DataMenuType = {
  id: string;
  label: string;
  depth: number;
  url: string;
  icon: React.ReactNode;
  children: DataMenuType[];
};

const data: DataMenuType[] = [
  {
    id: "dashboard",
    label: "dasbor",
    depth: 0,
    url: "/",
    icon: <InsertChartOutlined fontSize="small" />,
    children: [],
  },
  /* {
    id: "pos",
    label: "pos",
    depth: 0,
    url: "/pos",
    icon: <PointOfSale fontSize="small" />,
    children: [],
  }, */
  {
    id: "sales",
    label: "penjualan",
    depth: 0,
    url: "/sales",
    icon: <MonetizationOnOutlined fontSize="small" />,
    children: [
      /* {
        id: "sales-quotation",
        label: "quotation",
        depth: 1,
        url: "/sales/sales-quotations",
        icon: <FormatQuote fontSize="small" />,
        children: [],
      }, */
      {
        id: "sales-order",
        label: "pemesanan",
        depth: 1,
        url: "/sales/sales-orders",
        icon: <MenuBook fontSize="small" />,
        children: [],
      },
      /* {
        id: "sales-delivery",
        label: "delivery",
        depth: 1,
        url: "/sales/sales-deliveries",
        icon: <LocalShippingOutlined fontSize="small" />,
        children: [],
      }, */
      {
        id: "sales-invoice",
        label: "penjualan",
        depth: 1,
        url: "/sales/sales-invoices",
        icon: <AssignmentTurnedInOutlined fontSize="small" />,
        children: [],
      },
      /* {
        id: "sales-return",
        label: "return",
        depth: 1,
        url: "/sales/sales-returns",
        icon: <AssignmentReturn fontSize="small" />,
        children: [],
      }, */
    ],
  },
  {
    id: "purchase",
    label: "pembelian",
    depth: 0,
    url: "/purchase",
    icon: <ShoppingCartOutlined fontSize="small" />,
    children: [
      /* {
        id: "purchase-quotation",
        label: "quotation",
        depth: 1,
        url: "/purchase/purchase-quotations",
        icon: <FormatQuote fontSize="small" />,
        children: [],
      }, */
      {
        id: "purchase-order",
        label: "pemesanan",
        depth: 1,
        url: "/purchase/purchase-orders",
        icon: <MenuBook fontSize="small" />,
        children: [],
      },
      /* {
        id: "purchase-delivery",
        label: "delivery",
        depth: 1,
        url: "/purchase/purchase-deliveries",
        icon: <LocalShippingOutlined fontSize="small" />,
        children: [],
      }, */
      {
        id: "purchase-invoice",
        label: "pembelian",
        depth: 1,
        url: "/purchase/purchase-invoices",
        icon: <AssignmentTurnedInOutlined fontSize="small" />,
        children: [],
      },
      /* {
        id: "purchase-return",
        label: "return",
        depth: 1,
        url: "/purchase/purchase-returns",
        icon: <Undo fontSize="small" />,
        children: [],
      }, */
    ],
  },
  {
    id: "cashandbank",
    label: "kas dan bank",
    depth: 0,
    url: "/cashandbank",
    icon: <LocalAtmOutlined fontSize="small" />,
    children: [
      {
        id: "receivable-payments",
        label: "Terima Piutang",
        depth: 1,
        url: "/cashandbank/receivable-payments",
        icon: <SaveAltOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "payable-payments",
        label: "bayar hutang",
        depth: 1,
        url: "/cashandbank/payable-payments",
        icon: <PaymentOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "expenses",
        label: "pengeluaran",
        depth: 1,
        url: "/cashandbank/expenses",
        icon: <CallMadeOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "other-incomes",
        label: "Pemasukan",
        depth: 1,
        url: "/cashandbank/other-incomes",
        icon: <CallReceivedOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "transfer-funds",
        label: "transfer dana",
        depth: 1,
        url: "/cashandbank/transfer-funds",
        icon: <ImportExportOutlined fontSize="small" />,
        children: [],
      },
    ],
  },
  {
    id: "inventories",
    label: "inventaris",
    depth: 0,
    url: "/inventories",
    icon: <Inventory2Outlined fontSize="small" />,
    children: [
      {
        id: "stock-opname",
        label: "stock opname",
        depth: 1,
        url: "/inventories/stock-opname",
        icon: <ProductionQuantityLimits fontSize="small" />,
        children: [],
      },
    ],
  },
  {
    id: "other",
    label: "lain-lain",
    depth: 0,
    url: "/other",
    icon: <MoreOutlined fontSize="small" />,
    children: [
      {
        id: "journal-entry",
        label: "journal entry",
        depth: 1,
        url: "/other/journal-entry",
        icon: <CircleOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "all-trans",
        label: "semua transaksi",
        depth: 1,
        url: "/other/all-trans",
        icon: <CircleOutlined fontSize="small" />,
        children: [],
      },
    ],
  },
  {
    id: "masters",
    label: "data",
    depth: 0,
    url: "/",
    icon: <StorageOutlined fontSize="small" />,
    children: [
      {
        id: "products",
        label: "products",
        depth: 1,
        url: "/masters/products",
        icon: <LocalOfferOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "sales-prices",
        label: "harga jual",
        depth: 1,
        url: "/masters/sales-prices",
        icon: <PriceChange fontSize="small" />,
        children: [],
      },
      {
        id: "contacts",
        label: "kontak",
        depth: 1,
        url: "/masters/contacts",
        icon: <ContactsOutlined fontSize="small" />,
        children: [
          {
            id: "contact-customer",
            label: "pelanggan",
            depth: 2,
            url: "/masters/contacts/customers",
            icon: <Groups fontSize="small" />,
            children: [],
          },
          {
            id: "contact-supplier",
            label: "pemasok",
            depth: 2,
            url: "/masters/contacts/suppliers",
            icon: <Diversity3 fontSize="small" />,
            children: [],
          },
          {
            id: "contact-employee",
            label: "karyawan",
            depth: 2,
            url: "/masters/contacts/employees",
            icon: <Diversity2 fontSize="small" />,
            children: [],
          },
        ],
      },
      {
        id: "chart-of-accounts",
        label: "bagan akun",
        depth: 1,
        url: "/masters/chart-of-accounts",
        icon: <FormatListNumberedOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "others",
        label: "lain-lain",
        depth: 1,
        url: "/masters/others",
        icon: <StorefrontOutlined fontSize="small" />,
        children: [],
      },
    ],
  },
  {
    id: "reports",
    label: "laporan",
    depth: 0,
    url: "/reports",
    icon: <ReceiptLongOutlined fontSize="small" />,
    children: [],
  },
  {
    id: "activities",
    label: "aktivitas",
    depth: 0,
    url: "/activities",
    icon: <Hiking fontSize="small" />,
    children: [],
  },
  {
    id: "settings",
    label: "pengaturan",
    depth: 0,
    url: "/settings",
    icon: <SettingsApplicationsOutlined fontSize="small" />,
    children: [
      {
        id: "users",
        label: "pengguna",
        depth: 1,
        url: "/settings/users",
        icon: <GroupAddOutlined fontSize="small" />,
        children: [],
      },
      {
        id: "general-settings",
        label: "pengaturan umum",
        depth: 1,
        url: "/settings/general-settings",
        icon: <BuildCircleOutlined fontSize="small" />,
        children: [],
      },
      /* {
        id: "beginning-balance",
        label: "beginning balance",
        depth: 0,
        url: "/settings/beginning-balance",
        icon: <PlayCircleFilledWhiteOutlined fontSize="small" />,
        children: [],
      }, */
    ],
  },
];

export default data;
