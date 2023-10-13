export interface IDataTab {
  id: string;
  label: string;
  url: string;
}

export const productTabs: IDataTab[] = [
  {
    id: "item",
    label: "Barang",
    url: "/masters/products",
  },
  {
    id: "item-category",
    label: "Kategori",
    url: "/masters/products/categories",
  },
  {
    id: "uom",
    label: "Satuan",
    url: "/masters/products/unit-of-measures",
  },
  {
    id: "item-type",
    label: "Tipe",
    url: "/masters/products/item-types",
  },
];

export const chartOfAccountTabs: IDataTab[] = [
  {
    id: "chart-of-account",
    label: "Bagan Akun",
    url: "/masters/chart-of-accounts",
  },
  {
    id: "account-class",
    label: "Akun Utama",
    url: "/masters/chart-of-accounts/classes",
  },
  {
    id: "account-sub-class",
    label: "Sub Akun",
    url: "/masters/chart-of-accounts/sub-classes",
  },
];

export const customerTabs: IDataTab[] = [
  {
    id: "customer",
    label: "Pelanggan",
    url: "/masters/contacts/customers",
  },
  {
    id: "customer-category",
    label: "Kategori",
    url: "/masters/contacts/customers/categories",
  },
];

export const supplierTabs: IDataTab[] = [
  {
    id: "supplier",
    label: "Pemasok",
    url: "/masters/contacts/suppliers",
  },
  {
    id: "supplier-category",
    label: "Kategori",
    url: "/masters/contacts/suppliers/categories",
  },
];

export const employeeTabs: IDataTab[] = [
  {
    id: "employee",
    label: "Pemasok",
    url: "/masters/contacts/employees",
  },
  {
    id: "employee-category",
    label: "Kategori",
    url: "/masters/contacts/employees/categories",
  },
];

export const otherTabs: IDataTab[] = [
  {
    id: "warehouse",
    label: "Gudang",
    url: "/masters/other/warehouses",
  },
  {
    id: "tax",
    label: "Pajak",
    url: "/masters/other/taxes",
  },
  {
    id: "term",
    label: "Termin",
    url: "/masters/other/terms",
  },
];