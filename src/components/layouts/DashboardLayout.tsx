import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, type CSSObject, type Theme } from "@mui/material/styles";
import { useState, type PropsWithChildren } from "react";
import ThemeChanger from "../displays/ThemeChanger";
import DashboardHeader from "./Headers/DashboardHeader";
import SidebarMenu from "./Navigations/SidebarMenu";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

type DashboardProps = PropsWithChildren & {
  window?: () => Window;
};

const DashboardLayout = (props: DashboardProps) => {
  const { window } = props;
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const drawer = (
    <>
      <DrawerHeader>
        <IconButton onClick={handleDrawerOpen}>
          {open === false ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <div className="flex h-full flex-col justify-between">
        <SidebarMenu openDrawer={open} />
        <ThemeChanger />
      </div>
    </>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <DashboardHeader handleClick={handleDrawerOpen} />
      <MuiDrawer
        container={container}
        variant="temporary"
        open={open}
        onClose={handleDrawerOpen}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          // "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </MuiDrawer>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: "none", sm: "block" },
          // "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey.A200
              : theme.palette.background.default,
        }}
      >
        <Box className="flex flex-col">
          <DrawerHeader />
          <Box className="min-h-[87.5vh] flex-grow">{props.children}</Box>
        </Box>
      </Box>
    </Box>
  );
};
// hovering on DashboardLayout will give you this definition: const DashboardLayout: (props: PropsWithChildren) => JSX.Element
export default DashboardLayout;
