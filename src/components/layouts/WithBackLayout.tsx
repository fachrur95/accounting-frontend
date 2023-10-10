import Box from "@mui/material/Box";
import { type PropsWithChildren } from "react";
import BackHeader from "./Headers/BackHeader";

const WithBackLayout = (props: PropsWithChildren) => {
  return (
    <div className="flex flex-col">
      <BackHeader />
      <Box
        className="mt-16 flex-grow overflow-y-auto"
        /* sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey.A200
              : theme.palette.background.default,
        }} */
      >
        {props.children}
      </Box>
    </div>
  );
};
// hovering on WithBackLayout will give you this definition: const WithBackLayout: (props: PropsWithChildren) => JSX.Element
export default WithBackLayout;
