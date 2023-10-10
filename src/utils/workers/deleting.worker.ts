/* function doSetTimeout(id: string) {
  setTimeout(function () {
    console.log(id);
  }, 5000);
} */

import type { DeleteWorkerEventType, IEventDeleteWorker } from "@/types/worker";
import axios from "axios";

addEventListener("message", async (event: MessageEvent<DeleteWorkerEventType>) => {
  const req = event.data;
  switch (req.route) {
    case "procedure":
      for (const [index, id] of req.data.entries()) {
        const resultMessage: IEventDeleteWorker = {
          id,
          message: `Error Delete id=${id}`,
          variant: "error",
          path: req.path,
          progress: 0
        };
        await axios.delete<{ message: string }>(`/api/self/procedure?id=${id}`, { withCredentials: true, })
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
      break;

    default:
      break;
  }
});