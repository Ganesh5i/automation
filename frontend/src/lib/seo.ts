import type { Metadata } from "next";
import type { Job } from "@/generated/prisma/client";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

export function createMetadata({
  title,
  description,
  path = "",
}: {
  title?: string;
  description?: string;
  path?: string;
}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - ${SITE_TAGLINE}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description: description || SITE_TAGLINE,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title: fullTitle,
      description: description || SITE_TAGLINE,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || SITE_TAGLINE,
    },
    alternates: { canonical: url },
  };
}

export function jobPostingJsonLd(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.role,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: SITE_NAME,
      value: job.searchCode,
    },
    datePosted: job.postedDate.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.location,
      },
    },
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: { "@type": "QuantitativeValue", value: job.salary },
      },
    }),
  };
}
