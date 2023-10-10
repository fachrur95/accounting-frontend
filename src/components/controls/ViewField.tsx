import Typography from "@mui/material/Typography";
import React from "react";

interface IViewField extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: string | null;
}

const ViewField = ({ label, value, ...props }: IViewField) => {
  return (
    <div {...props}>
      <Typography variant="subtitle2" fontWeight={600} color="initial">
        {label}
      </Typography>
      <Typography variant="subtitle1" color="initial">
        {value ?? "-"}
      </Typography>
    </div>
  );
};

export default ViewField;
