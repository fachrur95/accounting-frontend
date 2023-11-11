import BuildCircleOutlined from "@mui/icons-material/BuildCircleOutlined";
import CallMadeOutlined from "@mui/icons-material/CallMadeOutlined";
import CallReceivedOutlined from "@mui/icons-material/CallReceivedOutlined";
import CircleOutlined from "@mui/icons-material/CircleOutlined";
import ContactsOutlined from "@mui/icons-material/ContactsOutlined";
// import Diversity2 from "@mui/icons-material/Diversity2";
import Diversity3 from "@mui/icons-material/Diversity3";
import FormatListNumberedOutlined from "@mui/icons-material/FormatListNumberedOutlined";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import Groups from "@mui/icons-material/Groups";
import AccessibilityNew from "@mui/icons-material/AccessibilityNew";
// import ImportExportOutlined from "@mui/icons-material/ImportExportOutlined";
import InsertChartOutlined from "@mui/icons-material/InsertChartOutlined";
import LocalAtmOutlined from "@mui/icons-material/LocalAtmOutlined";
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import MonetizationOnOutlined from "@mui/icons-material/MonetizationOnOutlined";
import MoreOutlined from "@mui/icons-material/MoreOutlined";
import PaymentOutlined from "@mui/icons-material/PaymentOutlined";
// import PriceChange from "@mui/icons-material/PriceChange";
import ProductionQuantityLimits from "@mui/icons-material/ProductionQuantityLimits";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import SaveAltOutlined from "@mui/icons-material/SaveAltOutlined";
import SettingsApplicationsOutlined from "@mui/icons-material/SettingsApplicationsOutlined";
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined";
import StorageOutlined from "@mui/icons-material/StorageOutlined";
import StorefrontOutlined from "@mui/icons-material/StorefrontOutlined";
import EditNote from "@mui/icons-material/EditNote";
import Book from "@mui/icons-material/Book";
import Widgets from "@mui/icons-material/Widgets";
import Category from "@mui/icons-material/Category";
import { Role } from "@/types/prisma-api/role.d";

export type DataMenuType = {
  id: string;
  label: string;
  depth: number;
  url: string;
  icon: React.ReactNode;
  roles: Role[];
  children: DataMenuType[];
};

const data: DataMenuType[] = [
  {
    id: "dashboard",
    label: "dasbor",
    depth: 0,
    url: "/",
    icon: <InsertChartOutlined fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
    children: [],
  },
  /* {
    id: "pos",
    label: "pos",
    depth: 0,
    url: "/pos",
    icon: <PointOfSale fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
    children: [],
  }, */
  {
    id: "sales",
    label: "penjualan",
    depth: 0,
    url: "/sales",
    icon: <MonetizationOnOutlined fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
    children: [
      /* {
        id: "sales-quotation",
        label: "quotation",
        depth: 1,
        url: "/sales/sales-quotations",
        icon: <FormatQuote fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "sales-order",
        label: "pemesanan",
        depth: 1,
        url: "/sales/sales-orders",
        icon: <MenuBook fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "sales-delivery",
        label: "delivery",
        depth: 1,
        url: "/sales/sales-deliveries",
        icon: <LocalShippingOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "sales-invoice",
        label: "penjualan",
        depth: 1,
        url: "/sales/sales-invoices",
        icon: <AssignmentTurnedInOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "sales-return",
        label: "return",
        depth: 1,
        url: "/sales/sales-returns",
        icon: <AssignmentReturn fontSize="small" />,
        roles: [Role.SUPERADMIN],
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
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
    children: [
      /* {
        id: "purchase-quotation",
        label: "quotation",
        depth: 1,
        url: "/purchase/purchase-quotations",
        icon: <FormatQuote fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "purchase-order",
        label: "pemesanan",
        depth: 1,
        url: "/purchase/purchase-orders",
        icon: <MenuBook fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "purchase-delivery",
        label: "delivery",
        depth: 1,
        url: "/purchase/purchase-deliveries",
        icon: <LocalShippingOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "purchase-invoice",
        label: "pembelian",
        depth: 1,
        url: "/purchase/purchase-invoices",
        icon: <AssignmentTurnedInOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
      {
        id: "purchase-return",
        label: "return",
        depth: 1,
        url: "/purchase/purchase-returns",
        icon: <Undo fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      }, */
    ],
  },
  {
    id: "cash-and-bank",
    label: "kas dan bank",
    depth: 0,
    url: "/cash-and-bank",
    icon: <LocalAtmOutlined fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
    children: [
      {
        id: "receivable-payment",
        label: "Terima Piutang",
        depth: 1,
        url: "/cash-and-bank/receivable-payments",
        icon: <SaveAltOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
        children: [],
      },
      {
        id: "payable-payment",
        label: "bayar hutang",
        depth: 1,
        url: "/cash-and-bank/payable-payments",
        icon: <PaymentOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      {
        id: "revenue",
        label: "Pemasukan",
        depth: 1,
        url: "/cash-and-bank/revenues",
        icon: <CallReceivedOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      {
        id: "expense",
        label: "pengeluaran",
        depth: 1,
        url: "/cash-and-bank/expenses",
        icon: <CallMadeOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      /* {
        id: "transfer-fund",
        label: "transfer dana",
        depth: 1,
        url: "/cash-and-bank/transfer-funds",
        icon: <ImportExportOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      }, */
    ],
  },
  /* {
    id: "inventories",
    label: "inventaris",
    depth: 0,
    url: "/inventories",
    icon: <Inventory2Outlined fontSize="small" />,
    roles: [Role.SUPERADMIN],
    children: [
      {
        id: "stock-opname",
        label: "stock opname",
        depth: 1,
        url: "/inventories/stock-opname",
        icon: <ProductionQuantityLimits fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      },
    ],
  }, */
  {
    id: "other",
    label: "lain-lain",
    depth: 0,
    url: "/other-transactions",
    icon: <MoreOutlined fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
    children: [
      {
        id: "stock-opname",
        label: "stock opname",
        depth: 1,
        url: "/other-transactions/stock-opname",
        icon: <ProductionQuantityLimits fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      {
        id: "journal-entry",
        label: "jurnal umum",
        depth: 1,
        url: "/other-transactions/journal-entries",
        icon: <EditNote fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      {
        id: "financial-closing",
        label: "tutup buku",
        depth: 1,
        url: "/other-transactions/financial-closings",
        icon: <Book fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      {
        id: "beginning-balance",
        label: "saldo awal",
        depth: 1,
        url: "/other-transactions/beginning-balances",
        icon: <Widgets fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [
          {
            id: "begin-balance-stock",
            label: "stock",
            depth: 2,
            url: "/other-transactions/beginning-balances/stocks",
            icon: <Category fontSize="small" />,
            roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
            children: [],
          },
          {
            id: "begin-balance-debt",
            label: "hutang",
            depth: 2,
            url: "/other-transactions/beginning-balances/debts",
            icon: <CircleOutlined fontSize="small" />,
            roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
            children: [],
          },
          {
            id: "begin-balance-receivable",
            label: "piutang",
            depth: 2,
            url: "/other-transactions/beginning-balances/receivables",
            icon: <CircleOutlined fontSize="small" />,
            roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
            children: [],
          },
        ],
      },
      {
        id: "all-transaction",
        label: "semua transaksi",
        depth: 1,
        url: "/other-transactions/all-transactions",
        icon: <CircleOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
    ],
  },
  {
    id: "master",
    label: "data",
    depth: 0,
    url: "/",
    icon: <StorageOutlined fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
    children: [
      {
        id: "product",
        label: "produk",
        depth: 1,
        url: "/masters/products",
        icon: <LocalOfferOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
        children: [],
      },
      /* {
        id: "price-book",
        label: "harga jual",
        depth: 1,
        url: "/masters/price-books",
        icon: <PriceChange fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      }, */
      {
        id: "contact",
        label: "kontak",
        depth: 1,
        url: "/masters/contacts",
        icon: <ContactsOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
        children: [
          {
            id: "customer",
            label: "pelanggan",
            depth: 2,
            url: "/masters/contacts/customers",
            icon: <Groups fontSize="small" />,
            roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
            children: [],
          },
          {
            id: "supplier",
            label: "pemasok",
            depth: 2,
            url: "/masters/contacts/suppliers",
            icon: <Diversity3 fontSize="small" />,
            roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
            children: [],
          },
          /* {
            id: "employee",
            label: "karyawan",
            depth: 2,
            url: "/masters/contacts/employees",
            icon: <Diversity2 fontSize="small" />,
            roles: [Role.SUPERADMIN],
            children: [],
          }, */
        ],
      },
      {
        id: "chart-of-account",
        label: "bagan akun",
        depth: 1,
        url: "/masters/chart-of-accounts",
        icon: <FormatListNumberedOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      {
        id: "other",
        label: "lain-lain",
        depth: 1,
        url: "/masters/other",
        icon: <StorefrontOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
    ],
  },
  {
    id: "report",
    label: "laporan",
    depth: 0,
    url: "/reports",
    icon: <ReceiptLongOutlined fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
    children: [],
  },
  {
    id: "activity",
    label: "aktivitas",
    depth: 0,
    url: "/activities",
    icon: <AccessibilityNew fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
    children: [],
  },
  {
    id: "setting",
    label: "pengaturan",
    depth: 0,
    url: "/settings",
    icon: <SettingsApplicationsOutlined fontSize="small" />,
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
    children: [
      {
        id: "users",
        label: "pengguna",
        depth: 1,
        url: "/settings/users",
        icon: <ManageAccounts fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      {
        id: "general-settings",
        label: "pengaturan umum",
        depth: 1,
        url: "/settings/general-settings",
        icon: <BuildCircleOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
        children: [],
      },
      /* {
        id: "beginning-balance",
        label: "beginning balance",
        depth: 0,
        url: "/settings/beginning-balance",
        icon: <PlayCircleFilledWhiteOutlined fontSize="small" />,
        roles: [Role.SUPERADMIN],
        children: [],
      }, */
    ],
  },
];

export default data;
