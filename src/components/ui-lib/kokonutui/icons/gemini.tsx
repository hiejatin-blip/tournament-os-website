import type { SVGProps } from "react";

/**
 * Gemini-style sparkle icon — vendored dependency of the KokonutUI
 * `profile-dropdown.tsx` (which imports `../icons/gemini`). Hand-drawn to
 * match the lucide icon contract (24x24, stroke-based, currentColor).
 */
export function GeminiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2c.4 4.9 1.6 8.6 4 11 2.4 2.4 6.1 3.6 6 4-.1.4-3.6 1.6-6 4-2.4 2.4-3.6 6.1-4 6-.4-4.9-1.6-8.6-4-11-2.4-2.4-6.1-3.6-6-4 .1-.4 3.6-1.6 6-4 2.4-2.4 3.6-6.1 4-6Z" />
    </svg>
  );
}

export default GeminiIcon;
