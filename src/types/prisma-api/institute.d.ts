import type { IUnit } from "./unit";

export declare interface IInstitute {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  units?: IUnit[];
}

export declare type IInstituteMutation = Pick<IInstitute, "name">