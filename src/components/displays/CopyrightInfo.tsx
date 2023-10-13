import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const CopyrightInfo = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://gogabook.com/">
        Gogabook Inc.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default CopyrightInfo;
