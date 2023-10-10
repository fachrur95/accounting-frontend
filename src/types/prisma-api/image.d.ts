import type { IItem } from "./item";

export interface IImage {
  id: string;
  imageUrl: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  itemId: string;
  item?: IItem;
}