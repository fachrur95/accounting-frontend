import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import { useRouter } from "next/router";
import { type DataMenuType } from "./data";

interface ISidebarItem {
  openDrawer: boolean;
  item: DataMenuType;
}

const SidebarItem = ({ openDrawer, item }: ISidebarItem) => {
  const router = useRouter();

  const nowPath = router.pathname;

  return (
    <Link
      href={item.url}
      className="text-[#202020] no-underline transition-all duration-300 dark:text-white"
    >
      <ListItemButton
        autoFocus={
          item.url === "/" ? nowPath === item.url : nowPath.includes(item.url)
        }
        selected={
          item.url === "/" ? nowPath === item.url : nowPath.includes(item.url)
        }
        sx={{ pl: openDrawer ? (item.depth + 1) * 2 : 2 }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} className="capitalize" />
      </ListItemButton>
    </Link>
  );
};

export default SidebarItem;
