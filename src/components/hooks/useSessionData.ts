import { api } from "@/utils/api";

const useSessionData = () => {
  const { data: dataSession, isFetching, refetch } = api.session.me.useQuery();

  return { data: dataSession, isFetching, refetch };
};

export default useSessionData;
