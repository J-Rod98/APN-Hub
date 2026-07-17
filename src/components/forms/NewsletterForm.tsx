"use client";

// Static-launch placeholder. APN does not collect subscriber data until a
// dedicated email service and consent flow are in place.
const CONTACT_EMAIL = "jonathanrod98@gmail.com";

export function NewsletterForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const link = "mailto:" + CONTACT_EMAIL + "?subject=APN%20Friday%20Update";

  if (variant === "light") {
    return (
      <div className="flex flex-col gap-3">
        <a
          href={link}
          className="inline-flex w-fit rounded-[14px] bg-sanctuary-ink px-7 py-4 text-[15px] font-bold text-white transition hover:brightness-125"
        >
          Email APN about updates
        </a>
        <p className="text-[13px] text-white/85">
          No signup form yet — APN is keeping the first launch simple.
        </p>
      </div>
    );
  }

  return (
    <a href={link} className="inline-flex rounded-full bg-brand px-5 py-3 font-bold text-white">
      Email APN about updates
    </a>
  );
}
