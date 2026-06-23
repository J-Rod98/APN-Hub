// ============================================================================
// Apostolic Power Network logo (inline SVG vector of the blue flame badge).
// Scalable + themeable, no image asset required.
//
// Want to use the EXACT PNG instead? Drop your file at
//   apn-hub/public/logo.png
// and swap the body of <FlameLogo> for:
//   import Image from "next/image";
//   return <Image src="/logo.png" width={size} height={size} alt="" priority />;
// ============================================================================

export function FlameLogo({ size = 34 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 70"
      fill="none"
      aria-hidden
      className="shrink-0 drop-shadow-[0_0_8px_rgba(47,139,255,0.45)]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* circle badge */}
      <circle cx="32" cy="40" r="26" fill="#3b40cf" />

      {/* outer flame (light cyan) */}
      <path
        d="M32 4 C 36 14, 44 19, 43 30 C 48 28, 48 21, 48 21 C 53 27, 56 34, 56 41
           C 56 52, 45 61, 32 61 C 19 61, 8 52, 9 41 C 9 34, 12 27, 16 22
           C 16 22, 15 28, 21 31 C 21 19, 28 14, 32 4 Z"
        fill="#bdeffb"
        stroke="#05070f"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* inner flame (royal blue) */}
      <path
        d="M33 20 C 37 28, 40 32, 39 40 C 39 47, 35 52, 30 50 C 26 48, 25 44, 28 40
           C 29 42, 31 42, 30 39 C 30 33, 31 27, 33 20 Z"
        fill="#3b40cf"
        stroke="#05070f"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* white droplet */}
      <path
        d="M34 38 C 38 44, 37 51, 32 51 C 28 51, 27 46, 30 42 C 31 40, 33 40, 34 38 Z"
        fill="#ffffff"
      />
    </svg>
  );
}

// Brand lockup: logo + "Apostolic Power Network".
export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2.5 font-extrabold tracking-tight">
      <FlameLogo size={size} />
      <span className="whitespace-nowrap text-[0.92rem] leading-tight sm:text-base">
        Apostolic Power <span className="text-brand-bright">Network</span>
      </span>
    </span>
  );
}
