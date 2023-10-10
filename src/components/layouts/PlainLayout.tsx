import { type PropsWithChildren } from "react";

const PlainLayout = (props: PropsWithChildren) => {
  return <>{props.children}</>;
};
// hovering on PlainLayout will give you this definition: const PlainLayout: (props: PropsWithChildren) => JSX.Element
export default PlainLayout;
