import type { ICashRegister } from "./cash-register";
import type { IChartOfAccount } from "./chart-of-account";
import type { IFinancialClosing } from "./financial-closing";
import type { IGeneralSetting } from "./general-setting";
import type { IInstitute } from "./institute";
import type { IItem } from "./item";
import type { IItemCategory } from "./item-category";
import type { IItemCogs } from "./item-cogs";
import type { IItemCogsDetail } from "./item-cogs-detail";
import type { IItemType } from "./item-type";
import type { ILogActivity } from "./log-activity";
import type { IMultipleUom } from "./multiple-uom";
import type { IPeople } from "./people";
import type { IPeopleCategory } from "./people-category";
import type { IPrefix } from "./prefix";
import type { IPriceBook } from "./price-book";
import type { ITax } from "./tax";
import type { ITerm } from "./term";
import type { ITransaction } from "./transaction";
import type { IUnitOfMeasure } from "./unit-of-measure";
import type { IUserUnit } from "./user-unit";
import type { IWarehouse } from "./warehouse";

export declare interface IUnit {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  instituteId: string;
  institute?: IInstitute;
  generalSetting?: IGeneralSetting | null;
  warehouses?: IWarehouse[];
  chartOfAccounts?: IChartOfAccount[];
  peopleCategories?: IPeopleCategory[];
  itemTypes?: IItemType[];
  prefixes?: IPrefix[];
  userUnits?: IUserUnit[];
  peoples?: IPeople[];
  itemCategories?: IItemCategory[];
  items?: IItem[];
  taxes?: ITax[];
  terms?: ITerm[];
  cashRegisters?: ICashRegister[];
  priceBooks?: IPriceBook[];
  multipleUoms?: IMultipleUom[];
  transactions?: ITransaction[];
  unitOfMeasures?: IUnitOfMeasure[];
  itemCogs?: IItemCogs[];
  itemCogsDetails?: IItemCogsDetail[];
  logActivities?: ILogActivity[];
  financialClosings?: IFinancialClosing[];
}

export declare type IUnitMutation = Pick<IUnit,
  | "instituteId"
  | "name"
>