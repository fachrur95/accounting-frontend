import React, { useEffect } from "react";
import CircularProgress, {
  type CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useAppStore } from "@/utils/store";
import useNotification from "@/components/hooks/useNotification";
// import { SnackbarContent, type SnackbarKey } from "notistack";
// import LinearProgress from "@mui/material/LinearProgress";
// import { IconButton } from "@mui/material";
// import Close from "@mui/icons-material/Close";
// import useNotification from "@/components/hooks/useNotification";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number }
) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const DeletingProcess = () => {
  const { toast, deletingProcess } = useAppStore();
  const { setOpenNotification } = useNotification();
  // const notificationRef = useRef<SnackbarKey | null>(null); // Ref untuk pemberitahuan
  // let snackbarId: string | number;

  // const progress = 0;

  useEffect(() => {
    if (toast.message !== "" && toast.message !== "done") {
      setOpenNotification(toast.message, { variant: toast.variant });
    }
  }, [toast, setOpenNotification]);

  /* useEffect(() => {
    // console.log({ keyId });
    if (deletingProcess > 0 && keyId === 0) {
      keyId = setOpenNotification(`Process ${deletingProcess}`);
      console.log({ keyId });
    }
    if (deletingProcess === 0) {
      setCloseNotification(keyId);
    }
  }, [deletingProcess, setOpenNotification, setCloseNotification]); */
  /* useEffect(() => {
    if (isDeleting) {
      // Jika pemberitahuan belum ditampilkan, tampilkan
      if (!notificationRef.current) {
        notificationRef.current = setOpenNotification("Deleting...", {
          variant: "info",
          persist: true,
          content: (key, message) => (
            <div>
              {message}
              <progress value={deletingProcess} max={100} />
            </div>
          ),
        });
      } else {
        setOpenNotification("", {
          key: notificationRef.current,
          content: (key, message) => (
            <div>
              {message}
              <progress value={deletingProcess} max={100} />
            </div>
          ),
        });
      }
    } else {
      // Reset state dan tutup pemberitahuan
      if (notificationRef.current) {
        setCloseNotification(notificationRef.current);
        notificationRef.current = null;
      }
    }
  }, [isDeleting, deletingProcess, setOpenNotification, setCloseNotification]); */

  if (deletingProcess === 0) return null;

  return (
    <div className="flex flex-row items-center gap-2">
      <Typography variant="subtitle2">Deleting ...</Typography>
      <CircularProgressWithLabel value={deletingProcess} />
    </div>
  );
};

export default DeletingProcess;
