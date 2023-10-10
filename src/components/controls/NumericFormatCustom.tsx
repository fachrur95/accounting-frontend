import { forwardRef } from "react";
import { NumericFormat, type NumberFormatValues } from "react-number-format";
import type { NumericFormatProps } from "react-number-format/types/types";

interface CustomProps {
  onChange?: (event: { target: { name: string; value: number } }) => void;
  name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
  function NumericFormatCustom(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values: NumberFormatValues) => {
          typeof onChange === "function" &&
            onChange({
              target: {
                name: props.name,
                value: values.floatValue ?? 0,
              },
            });
        }}
        onFocus={(e) => e.target.select()}
        valueIsNumericString
        decimalSeparator=","
        thousandSeparator="."
        allowLeadingZeros={false}
        allowNegative={false}
        style={{ textAlign: "right" }}
      />
    );
  }
);

NumericFormatCustom.displayName = "NumericFormatCustom";

export default NumericFormatCustom;
