import type { Metadata } from "next";

export const SITE_URL = "https://apn-hub.netlify.app";
export const DEFAULT_SOCIAL_IMAGE =
  "https://upci.org/wp-content/uploads/2022/04/UPCI_Home_Slider8.jpg";

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = "Apostolic worship at a UPCI gathering.",
}: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const socialImage = image ?? DEFAULT_SOCIAL_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: socialImage, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}
