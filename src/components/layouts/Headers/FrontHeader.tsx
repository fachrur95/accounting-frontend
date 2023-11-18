import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CoreHeader from "./CoreHeader";

interface HeaderProps {
  window?: () => Window;
}

const FrontHeader = (props: HeaderProps) => {
  return (
    <CoreHeader {...props}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {process.env.NEXT_PUBLIC_APP_TITLE}
        </Typography>
      </Toolbar>
    </CoreHeader>
  );
};

export default FrontHeader;
