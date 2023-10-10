import { createContext } from "react";

type WorkerContextType = {
  deleteWorker?: React.MutableRefObject<Worker | undefined>
  // deleteWorker?: Worker
}
const defaultWorkerContext: WorkerContextType = {
  deleteWorker: undefined,
}

export const WorkerContext = createContext<WorkerContextType>(defaultWorkerContext);