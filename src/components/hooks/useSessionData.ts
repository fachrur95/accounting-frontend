import { api } from "@/utils/api";

const useSessionData = () => {
  const { data: dataSession, isFetching } = api.session.me.useQuery();

  return { data: dataSession, isFetching };
};

export default useSessionData;
