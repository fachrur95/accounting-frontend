import DarkMode from "@mui/icons-material/DarkMode";
import LightMode from "@mui/icons-material/LightMode";
import SettingsBrightness from "@mui/icons-material/SettingsBrightness";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { useTheme } from "next-themes";
import React, { useState } from "react";

const themeList = [
  {
    id: "system",
    label: "Sistem",
    icon: <SettingsBrightness />,
  },
  {
    id: "light",
    label: "Light",
    icon: <LightMode />,
  },
  {
    id: "dark",
    label: "Dark",
    icon: <DarkMode />,
  },
];

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    _: React.MouseEvent<HTMLElement>,
    themeName: string
  ) => {
    setTheme(themeName);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <List
        component="nav"
        aria-label="Device settings"
        sx={{ bgcolor: "background.paper" }}
      >
        <ListItemButton
          id="lock-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="when device is locked"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <ListItemIcon>
            {theme === "light" ? (
              <LightMode />
            ) : theme === "dark" ? (
              <DarkMode />
            ) : (
              <SettingsBrightness />
            )}
          </ListItemIcon>
          <ListItemText primary="Theme Mode" secondary={theme ?? "system"} />
        </ListItemButton>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
      >
        <MenuList sx={{ width: 200, maxWidth: "100%" }} dense>
          {themeList.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === theme}
              onClick={(event) => handleMenuItemClick(event, option.id)}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </div>
  );
};

export default ThemeChanger;
