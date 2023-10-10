import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import CoreHeader from "./CoreHeader";

interface BackHeaderProps {
  window?: () => Window;
}

const BackHeader = (props: BackHeaderProps) => {
  const router = useRouter();
  const { pathname: path } = router;
  const pathname = path?.split("/");

  const lastPath: string =
    pathname?.[pathname.length - 1]?.split("-")?.join(" ") ?? "";
  const beforeLastPath: string =
    pathname?.[pathname.length - 2]?.split("-")?.join(" ") ?? "";

  const handleClose = (): void => void router.back();

  return (
    <Box>
      <CoreHeader {...props}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleClose}
          >
            <ArrowBackIos />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="capitalize"
          >
            {lastPath === "form" ? `${lastPath} ${beforeLastPath}` : lastPath}
          </Typography>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </CoreHeader>
    </Box>
  );
};

export default BackHeader;
