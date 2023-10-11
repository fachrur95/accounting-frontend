import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
// import { Avatar } from "@mui/material";
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

interface HeaderProps {
  window?: () => Window;
  handleClick: () => void;
}

const DashboardHeader = (props: HeaderProps) => {
  const { data: sessionData } = useSessionData();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  console.log({ sessionData });

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
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem> */}
      {/* <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
      <MenuItem onClick={() => void signOut()}>Logout</MenuItem>
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
