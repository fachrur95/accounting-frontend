import RefreshTokenHandler from "@/components/RefreshTokenHandler";
import { Layouts } from "@/components/layouts";
import { LoadingPage } from "@/components/layouts/LoadingPage";
import { type MyAppProps } from "@/components/layouts/layoutTypes";
import { GlobalContextProvider } from "@/context/GlobalContext";
import { WorkerContext } from "@/context/WorkerContext";
import "@/styles/globals.css";
import type { IEventDeleteWorker } from "@/types/worker";
import { api } from "@/utils/api";
import { useAppStore } from "@/utils/store";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as TwProvider } from "next-themes";
import NextNProgress from "nextjs-progressbar";
import { useCallback, useEffect, useRef, useState } from "react";

// import ConnectionProvider from "@/components/displays/ConnectionProvider";
// import Router from "next/router";
// import NProgress from "nprogress"; //nprogress module
// import "nprogress/nprogress.css"; //styles of nprogress

// //Route Events.
// Router.events.on("routeChangeStart", () => NProgress.start());
// Router.events.on("routeChangeComplete", () => NProgress.done());
// Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: MyAppProps) => {
  const Layout =
    Layouts[Component?.Layout ?? "Plain"] ?? ((page: unknown) => page);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [interval, setInterval] = useState<number>(0);

  const deleteWorker = useRef<Worker>();
  const { setToast, setDeletingProcess } = useAppStore();

  const handleReceiveDeleteResponse = useCallback(
    (event: MessageEvent<IEventDeleteWorker>) => {
      const data = event.data;
      setToast({
        message: data.message,
        variant: data.variant,
        path: data.path ?? undefined,
      });
      setDeletingProcess(data.progress ?? 0);
    },
    [setToast, setDeletingProcess],
  );

  useEffect(() => {
    deleteWorker.current = new Worker(
      new URL("@/utils/workers/deleting.worker.ts", import.meta.url),
    );
    deleteWorker.current.onmessage = handleReceiveDeleteResponse;
    return () => {
      deleteWorker.current?.terminate();
    };
  }, [handleReceiveDeleteResponse]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <LoadingPage />;
  }

  return (
    <TwProvider enableSystem={true} attribute="class" defaultTheme="system">
      <GlobalContextProvider>
        <WorkerContext.Provider value={{ deleteWorker }}>
          <SessionProvider
            session={session as Session}
            refetchInterval={interval}
          >
            {/* <ConnectionProvider> */}
            <Layout>
              <NextNProgress color="#fff" height={4} />
              <Component {...pageProps} />
              <RefreshTokenHandler setInterval={setInterval} />
            </Layout>
            {/* </ConnectionProvider> */}
          </SessionProvider>
        </WorkerContext.Provider>
      </GlobalContextProvider>
    </TwProvider>
  );
};

export default api.withTRPC(MyApp);
