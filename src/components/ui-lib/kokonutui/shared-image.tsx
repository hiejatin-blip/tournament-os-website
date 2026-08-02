import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * next/image shim for vendored KokonutUI components.
 * Supports the subset of next/image props used by the vendored files:
 * `src`, `alt`, `height`, `width`, `fill` (absolute cover mode), `className`.
 */
type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  fill?: boolean;
  height?: number;
  width?: number;
};

export function Image({ fill, className, ...rest }: ImageProps) {
  return (
    <img
      {...rest}
      className={cn(
        fill && "absolute inset-0 h-full w-full object-cover",
        className,
      )}
    />
  );
}
