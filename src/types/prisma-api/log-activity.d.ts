import type { ActivityType } from "./activity-type";
import type { IUnit } from "./unit";
import type { IUser } from "./user";

export interface ILogActivity {
  id: string;
  message: string;
  data: string | null;
  activityType: ActivityType;
  createdAt: Date;
  createdBy: string;
  unitId: string | null;
  userId: string | null;
  unit?: IUnit | null;
  user?: IUser;
}