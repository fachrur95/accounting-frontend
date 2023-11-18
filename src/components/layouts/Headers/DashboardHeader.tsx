import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import CoreHeader from "./CoreHeader";
import useSessionData from "@/components/hooks/useSessionData";
import DeletingProcess from "./DeletingProcess";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Settings from "@mui/icons-material/Settings";
import ListItemIcon from "@mui/material/ListItemIcon";
import Logout from "@mui/icons-material/Logout";
import AccountBalance from "@mui/icons-material/AccountBalance";
import Store from "@mui/icons-material/Store";
import Link from "next/link";

interface HeaderProps {
  window?: () => Window;
  handleClick: () => void;
}

const DashboardHeader = (props: HeaderProps) => {
  const { data: sessionData } = useSessionData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      slotProps={{
        paper: {
          elevation: 0,
          sx: {
            minWidth: 250,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        },
      }}
    >
      <Link
        href="/profile"
        className="text-[#202020] no-underline transition-all duration-300 dark:text-white"
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Avatar />
          </ListItemIcon>
          Akun Saya
        </MenuItem>
      </Link>
      <Link
        href="/credentials/institute"
        className="text-[#202020] no-underline transition-all duration-300 dark:text-white"
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          {sessionData?.session?.institute?.name ?? ""}
        </MenuItem>
      </Link>
      <Link
        href="/credentials/unit"
        className="text-[#202020] no-underline transition-all duration-300 dark:text-white"
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Store />
          </ListItemIcon>
          {sessionData?.session?.unit?.name ?? ""}
        </MenuItem>
      </Link>
      <Divider />
      <Link
        href="/settings/general-settings"
        className="text-[#202020] no-underline transition-all duration-300 dark:text-white"
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Pengaturan
        </MenuItem>
      </Link>
      <MenuItem onClick={() => void signOut()}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Keluar
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          {/* {session?.user.image ? (
            <Avatar src={session?.user.image} />
          ) : (
            )} */}
          <AccountCircle />
        </IconButton>
        <p>{sessionData?.name ?? "-"}</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <CoreHeader {...props}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={props.handleClick}
          >
            <MenuIcon />
          </IconButton>
          <div className="flex flex-row items-center gap-2">
            <Image
              alt="logo"
              src="/img/logo-p2s3.png"
              loading="lazy"
              width={163}
              height={49}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
          {/* <SearchInput /> */}
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={{ display: { xs: "none", md: "flex" } }}
            className="items-center"
          >
            <DeletingProcess />
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col items-end justify-center">
                <Typography variant="subtitle2" className="capitalize">
                  {sessionData?.session?.institute?.name ?? ""}
                </Typography>
                <Typography variant="body2">
                  {sessionData?.session?.unit?.name ?? ""}
                </Typography>
              </div>
              <Divider orientation="vertical" flexItem />
              <div className="flex flex-col items-end justify-center">
                <Typography variant="subtitle2" className="capitalize">
                  {sessionData?.name ?? "-"}
                </Typography>
                <Typography variant="body2">
                  {sessionData?.role ?? "-"}
                </Typography>
              </div>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {/* {session?.user.image ? (
                  <Avatar src={session?.user.image} />
                ) : (
                  )} */}
                <AccountCircle />
              </IconButton>
            </div>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </CoreHeader>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default DashboardHeader;
