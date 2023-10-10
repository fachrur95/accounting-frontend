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
        {/* <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {process.env.NEXT_PUBLIC_APP_TITLE}
        </Typography>
        {/* <Button color="inherit">Login</Button> */}
      </Toolbar>
    </CoreHeader>
  );
};

export default FrontHeader;
