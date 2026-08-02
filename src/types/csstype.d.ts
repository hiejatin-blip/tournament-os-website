/**
 * csstype augmentation: the frozen `HaloBootPhase.tsx` sets `scaleX` inside a
 * React `style` object. `scaleX` is a CSS *transform function*, not a CSS
 * property, so csstype does not include it. We augment the interface rather
 * than modifying the frozen boot file.
 */
import "csstype";

declare module "csstype" {
  interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {
    scaleX?: TLength | "none" | undefined;
    scaleY?: TLength | "none" | undefined;
  }
}
