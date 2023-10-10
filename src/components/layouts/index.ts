import DashboardLayout from "./DashboardLayout";
import FrontLayout from "./FrontLayout";
import ImageLayout from "./ImageLayout";
import PlainLayout from "./PlainLayout";
import WithBackLayout from "./WithBackLayout";

export const Layouts = {
  Front: FrontLayout,
  Dashboard: DashboardLayout,
  WithBack: WithBackLayout,
  Plain: PlainLayout,
  Image: ImageLayout,
};
export type LayoutKeys = keyof typeof Layouts; // "Front" | "Admin" | "Back" | "Product" | "Plain"
