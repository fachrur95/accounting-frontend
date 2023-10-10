import type { IPeopleCategory } from "./people-category";
import type { IPriceBookDetail } from "./price-book-detail";
import type { IUnit } from "./unit";

export interface IPriceBook {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  note: string | null;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  peopleCategoryId: string | null;
  unitId: string;
  unit?: IUnit;
  peopleCategory?: IPeopleCategory | null;
  priceBookDetails?: IPriceBookDetail[];
}