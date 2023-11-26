
export declare interface IDataOption {
  id: string;
  label: string;
  title?: string;
  inputValue?: string;
  conversionQty?: number;
  price?: number;
  specialDiscount?: number;
  isStock?: boolean;
  image?: string;
  phone?: string;
  address?: string;
}

export declare type AutoDefault = {
  id: string | number;
  label: string;
};