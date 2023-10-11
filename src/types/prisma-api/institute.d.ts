import type { IUnit } from "./unit";

export interface IInstitute {
  id: string;
  name: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string | null;
  units?: IUnit[];
}

export type IInstituteMutation = Pick<IInstitute, "name">