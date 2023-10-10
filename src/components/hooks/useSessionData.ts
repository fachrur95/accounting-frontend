import { api } from "@/utils/api";

const useSessionData = () => {
  const { data: dataSession } = api.session.me.useQuery();

  return { data: dataSession };
};

export default useSessionData;
