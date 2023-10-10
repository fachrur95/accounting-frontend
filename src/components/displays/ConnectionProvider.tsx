import { useSnackbar } from "notistack";
import React from "react";
import { Detector } from "react-detect-offline";

interface ConnectionProviderProps {
  children: React.ReactNode;
}

const ConnectionProvider = ({ children }: ConnectionProviderProps) => {
  let snackbarId: string | number;
  const { closeSnackbar } = useSnackbar();

  return (
    <Detector
      /* polling={{
        url: `${process.env.NEXT_PUBLIC_API_CONNECTION}check-connection`,
        enabled: true,
        interval: 5000,
        timeout: 10000,
        // url: "https://gogabook.com/check-connection",
      }} */
      render={() => <div>{children}</div>}
      onChange={(status: boolean): void => {
        if (status === false) {
          /* snackbarId = enqueueSnackbar("Your connection is unstable!", {
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            variant: "error",
            persist: true,
          }); */
        } else {
          closeSnackbar(snackbarId);
        }
      }}
    />
  );
};

export default ConnectionProvider;
