import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const CopyrightInfo = () => {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://p2s3.com/">
        Bidang Usaha PP. Salafiyah Syafi'iyah Sukorejo.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default CopyrightInfo;
