export interface IDataOption {
  id: string;
  label: string;
  title?: string;
  inputValue?: string;
}

export type AutoDefault = {
  id: string | number;
  label: string;
};