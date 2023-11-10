import React from "react";
import { FormContainer, type UseFormReturn } from "react-hook-form-mui";
import DatePicker from "./DatePicker";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

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
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          <DatePicker name="startDate" label="Mulai" maxDate={endDate} />
          <DatePicker name="endDate" label="Sampai" minDate={startDate} />
        </div>
      </FormContainer>
    </Box>
  );
};

export default DateFilter;
