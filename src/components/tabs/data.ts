import { Role } from "@/types/prisma-api/role.d";

export interface IDataTab {
  id: string;
  label: string;
  url: string;
  roles: Role[];
}

export const productTabs: IDataTab[] = [
  {
    id: "item",
    label: "Barang",
    url: "/masters/products",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
  },
  {
    id: "item-category",
    label: "Kategori",
    url: "/masters/products/categories",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
  {
    id: "uom",
    label: "Satuan",
    url: "/masters/products/unit-of-measures",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
  {
    id: "item-type",
    label: "Tipe",
    url: "/masters/products/item-types",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
];

export const chartOfAccountTabs: IDataTab[] = [
  {
    id: "chart-of-account",
    label: "Bagan Akun",
    url: "/masters/chart-of-accounts",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
  {
    id: "account-class",
    label: "Akun Utama",
    url: "/masters/chart-of-accounts/classes",
    roles: [Role.SUPERADMIN, Role.AUDITOR],
  },
  {
    id: "account-sub-class",
    label: "Sub Akun",
    url: "/masters/chart-of-accounts/sub-classes",
    roles: [Role.SUPERADMIN, Role.AUDITOR],
  },
];

export const customerTabs: IDataTab[] = [
  {
    id: "customer",
    label: "Pelanggan",
    url: "/masters/contacts/customers",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN, Role.USER],
  },
  {
    id: "customer-category",
    label: "Kategori",
    url: "/masters/contacts/customers/categories",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
];

export const supplierTabs: IDataTab[] = [
  {
    id: "supplier",
    label: "Pemasok",
    url: "/masters/contacts/suppliers",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
  {
    id: "supplier-category",
    label: "Kategori",
    url: "/masters/contacts/suppliers/categories",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
];

export const employeeTabs: IDataTab[] = [
  {
    id: "employee",
    label: "Pemasok",
    url: "/masters/contacts/employees",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
  {
    id: "employee-category",
    label: "Kategori",

    url: "/masters/contacts/employees/categories",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
];

export const otherTabs: IDataTab[] = [
  /* {
    id: "warehouse",
    label: "Gudang",
    url: "/masters/other/warehouses",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  }, */
  {
    id: "cash-register",
    label: "Mesin Kasir",
    url: "/masters/other/cash-registers",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
  {
    id: "term",
    label: "Termin",
    url: "/masters/other/terms",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  },
  /* {
    id: "tax",
    label: "Pajak",
    url: "/masters/other/taxes",
    roles: [Role.SUPERADMIN, Role.AUDITOR, Role.ADMIN],
  }, */
];