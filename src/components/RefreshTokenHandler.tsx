import { useSession } from "next-auth/react";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import type { IJwtDecode } from "@/types/session";

const RefreshTokenHandler = ({
  setInterval,
}: {
  setInterval: (interval: number) => void;
}) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!!session) {
      // We did set the token to be ready to refresh after 23 hours, here we set interval of 23 hours 30 minutes.
      const tokenData = jwtDecode<IJwtDecode>(session.accessToken);
      const timeRemaining = Math.round(
        ((tokenData.exp - 30 * 60) * 1000 - Date.now()) / 1000,
      );
      setInterval(timeRemaining > 0 ? timeRemaining : 0);
    }
  }, [session, setInterval]);

  return null;
};

export default RefreshTokenHandler;
