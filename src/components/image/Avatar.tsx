'use client'

import type { ResponsiveValue } from "@chakra-ui/react";
import type * as CSS from "csstype";
import { chakra, useColorMode } from "@chakra-ui/system";
import { ComponentProps } from "react";
import { Image } from "./Image";

type AvatarImageProps = Partial<
  ComponentProps<typeof Image> & {
    showBorder?: boolean;
  }
>;

export function NextAvatar({
  src,
  showBorder,
  alt = "",
  style,
  ...props
}: AvatarImageProps) {
  const { colorMode } = useColorMode();

  // ✅ DECLARE HERE (before return), not inside JSX
  const objectFit: ResponsiveValue<CSS.Property.ObjectFit> = "cover";

  return (
    <Image
      {...props}
      {...(showBorder
        ? {
            border: "2px",
            borderColor: colorMode === "dark" ? "navy.700" : "white",
          }
        : {})}
      alt={alt}
      objectFit={objectFit}
      src={src}
      style={{ ...style, borderRadius: "50%" }}
    />
  );
}

export const ChakraNextAvatar = chakra(NextAvatar, {
  shouldForwardProp: (prop) =>
    ["width", "height", "src", "alt", "layout"].includes(prop),
});
