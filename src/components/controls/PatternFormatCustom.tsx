import { forwardRef } from "react";
import { PatternFormat } from "react-number-format";
import type { PatternFormatProps } from "react-number-format/types/types";

interface CustomProps {
  name: string;
}

const PatternFormatCustom = forwardRef<PatternFormatProps, CustomProps>(
  function PatternFormatCustom(props, ref) {
    return (
      <PatternFormat
        {...props}
        getInputRef={ref}
        /* onValueChange={(values: PatternFormatValues) => {
          typeof onChange === "function" &&
            onChange({
              target: {
                name: props.name,
                value: values.floatValue ?? 0,
              },
            });
        }} */
        format="## ### #### #### ##"
        allowEmptyFormatting
        // mask="_"
        onFocus={(e) => e.target.select()}
      />
    );
  },
);

PatternFormatCustom.displayName = "PatternFormatCustom";

export default PatternFormatCustom;
