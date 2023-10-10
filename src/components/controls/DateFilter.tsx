import React from "react";
import { FormContainer, type UseFormReturn } from "react-hook-form-mui";
import DatePicker from "./DatePicker";
import { Box, Paper } from "@mui/material";

export type FilterDateFormType = {
  startDate: Date;
  endDate: Date;
};

const DateFilter = ({
  formContext,
  endDate,
  startDate,
}: {
  formContext: UseFormReturn<FilterDateFormType>;
  endDate: Date;
  startDate: Date;
}) => {
  return (
    <Box component={Paper} className="p-2">
      <FormContainer formContext={formContext}>
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <DatePicker
            name="startDate"
            label="Mulai"
            size="small"
            maxDate={endDate}
          />
          <DatePicker
            name="endDate"
            label="Sampai"
            size="small"
            minDate={startDate}
          />
        </div>
      </FormContainer>
    </Box>
  );
};

export default DateFilter;
