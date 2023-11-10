import type { DeleteWorkerEventType, IEventDeleteWorker } from "@/types/worker";
import axios from "axios";

addEventListener("message", async (event: MessageEvent<DeleteWorkerEventType>) => {
  const req = event.data;
  for (const [index, id] of req.data.entries()) {
    const resultMessage: IEventDeleteWorker = {
      id,
      message: `Error Delete id=${id}`,
      variant: "error",
      path: req.path,
      progress: 0
    };

    await axios.delete<{ message: string }>(`/api/delete/${req.path}/${id}`, { withCredentials: true, })
      .then((response) => {
        const data = response.data;
        resultMessage.variant = "success";
        resultMessage.message = data.message;
      }).catch((err: { response: { data: { message: string } } }) => {
        const data = err.response.data;
        resultMessage.message = data.message ?? `Error Delete id=${id}`;
      });

    resultMessage.progress = ((index + 1) / req.data.length) * 100;
    postMessage(resultMessage);
  }
  postMessage({
    id: null,
    message: "done",
    variant: "default",
    path: req.path
  } as IEventDeleteWorker)
});