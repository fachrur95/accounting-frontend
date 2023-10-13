// import { api } from "@/utils/api";
import { LoadingButton } from "@mui/lab";
import React, { useContext, useEffect, useState } from "react";
// import useNotification from "./Notification";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";
import Delete from "@mui/icons-material/Delete";
// import { useAppStore } from "@/utils/store";
import type { DeleteWorkerEventType, WorkerPathType } from "@/types/worker";
// import { useAppStore } from "@/utils/store";
import type { DeletingType } from "@/utils/store/slices/appPersist";
import { WorkerContext } from "@/context/WorkerContext";
import { useAppStore } from "@/utils/store";

const DeleteMultiple = ({
  path,
  ids,
  handleRefresh,
}: {
  path: WorkerPathType;
  ids: string[];
  handleRefresh?: () => void;
}) => {
  // const { data } = useSession();
  // console.log()
  const [open, setOpen] = useState<boolean>(false);
  const { deleteWorker } = useContext(WorkerContext);
  const { toast, setToast, isDeleting, setIsDeleting } = useAppStore();

  const handleDelete = () => {
    setOpen(false);
    setIsDeleting(true);
    deleteWorker?.current?.postMessage({
      path,
      data: ids,
    } as DeleteWorkerEventType);
  };

  useEffect(() => {
    if (toast.message === "done" && path === toast.path) {
      setIsDeleting(false);
      setToast({ message: "" });
      typeof handleRefresh === "function" && handleRefresh();
    }
  }, [toast, handleRefresh, setToast, setIsDeleting, path]);

  if (ids.length === 0) return null;

  return (
    <>
      <LoadingButton
        onClick={() => setOpen(true)}
        loading={isDeleting}
        startIcon={<Delete />}
        color="error"
      >
        Delete
      </LoadingButton>
      <ConfirmationDialog
        open={open}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus ini?"
        onClose={() => setOpen(false)}
        onSubmit={handleDelete}
      />
    </>
  );
};

export default DeleteMultiple;
