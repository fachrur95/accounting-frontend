import {
  type NextComponentType,
  type NextPage,
  type NextPageContext,
} from "next";
import { type Session } from "next-auth";
import { type AppProps, type AppType } from "next/app";
import { type LayoutKeys } from ".";

// eslint-disable-next-line @typescript-eslint/ban-types
export type MyPage<P = {}, IP = P> = NextPage<P, IP> & {
  Layout?: LayoutKeys;
};

export type MyAppProps = AppProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: NextComponentType<NextPageContext, any, any> & {
    Layout?: LayoutKeys;
  };
} & AppType<{ session: Session | null }>;
