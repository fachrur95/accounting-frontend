import Image from "next/image";
import { type PropsWithChildren } from "react";
import Toolbar from "@mui/material/Toolbar";

const ImageLayout = (props: PropsWithChildren) => {
  return (
    <div>
      <Image
        src="/img/bg-full.png"
        alt="imageBackground"
        loading="lazy"
        fill
        className="-z-10"
        style={{
          objectFit: "cover",
          // maxWidth: "100%",
          // height: "auto",
        }}
      />
      <Toolbar id="back-to-top-anchor" />
      {props.children}
    </div>
  );
};
// hovering on ImageLayout will give you this definition: const ImageLayout: (props: PropsWithChildren) => JSX.Element
export default ImageLayout;
