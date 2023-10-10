import Box from "@mui/material/Box";
import { type PropsWithChildren } from "react";
import FrontHeader from "./Headers/FrontHeader";

const FrontLayout = (props: PropsWithChildren) => {
  return (
    <>
      <FrontHeader />
      <Box
        component="main"
        sx={{
          p: 3,
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey.A200
              : theme.palette.background.default,
        }}
      >
        {props.children}
      </Box>
    </>
  );
};
// hovering on FrontLayout will give you this definition: const FrontLayout: (props: PropsWithChildren) => JSX.Element
export default FrontLayout;
