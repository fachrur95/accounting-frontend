import { useAppStore } from "@/utils/store";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SidebarItem from "./SidebarItem";
import { type DataMenuType } from "./data";

interface ISidebarCollapse {
  openDrawer: boolean;
  item: DataMenuType;
}

const SidebarCollapse = ({ openDrawer, item }: ISidebarCollapse) => {
  const router = useRouter();
  const pathName = router.pathname;
  const { openMenu: open, setOpenMenu } = useAppStore();
  const [domLoaded, setDomLoaded] = useState(false);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  useEffect(() => {
    if (item.url !== "/" && pathName.includes(item.url)) {
      setOpenMenu(item.url, true);
    }
  }, [setOpenMenu, pathName, item]);

  if (domLoaded === false) {
    return null;
  }

  return (
    <>
      <ListItemButton
        sx={{ pl: openDrawer ? (item.depth + 1) * 2 : 2 }}
        onClick={() => setOpenMenu(item.url)}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.label} className="capitalize" />
        {open[item.url] ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open[item.url]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.length > 0 &&
            item.children.map((child, index) =>
              child.children.length > 0 ? (
                <NavCollapse
                  key={`list-of-child-col-${index}`}
                  openDrawer={openDrawer}
                  item={child}
                />
              ) : (
                <SidebarItem
                  key={`list-of-child-item-${index}`}
                  openDrawer={openDrawer}
                  item={child}
                />
              ),
            )}
        </List>
      </Collapse>
    </>
  );
};

const NavCollapse = React.memo(SidebarCollapse);
SidebarCollapse.displayName = "SidebarCollapse";

export default SidebarCollapse;
