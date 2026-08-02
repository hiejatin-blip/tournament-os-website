import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

/**
 * next/link shim for vendored KokonutUI components.
 * Accepts the next/link prop surface (`href`, `target`, `className`,
 * `onClick`) and renders a react-router `<Link>`.
 */
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

export function Link({ href, children, ...rest }: LinkProps) {
  return (
    <RouterLink to={href} {...rest}>
      {children}
    </RouterLink>
  );
}
