import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Paper from "@mui/material/Paper";
import { type IDataTab } from "./data";
import { useRouter } from "next/router";

interface LinkTabProps {
  label?: string;
  value?: string;
  href: string;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component={Link}
      /* onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }} */
      {...props}
    />
  );
}

interface INavTabs {
  data: IDataTab[];
}

const NavTabs = ({ data }: INavTabs) => {
  const router = useRouter();
  const pathName = router.pathname;

  return (
    <AppBar
      component={Paper}
      position="static"
      sx={{
        width: "100%",
        px: 2,
      }}
    >
      <Tabs
        aria-label="nav tabs"
        variant="scrollable"
        scrollButtons="auto"
        textColor="inherit"
        value={pathName}
      >
        {data.map((tab) => (
          <LinkTab
            key={tab.id}
            value={tab.url}
            label={tab.label}
            href={tab.url}
          />
        ))}
      </Tabs>
    </AppBar>
  );
};

export default NavTabs;
