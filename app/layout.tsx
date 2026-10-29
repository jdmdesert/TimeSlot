import type { Metadata } from "vinext/shims/metadata";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "timeslot.app";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "TimeSlot — Book your next look",
    description: "A modern appointment booking platform for barbers, stylists, and beauty professionals.",
    openGraph: {
      title: "TimeSlot — Book your next look",
      description: "Appointments that fit your life.",
      type: "website",
      images: [{ url: imageUrl, width: 1734, height: 906, alt: "TimeSlot — Book your next look." }],
    },
    twitter: { card: "summary_large_image", title: "TimeSlot — Book your next look", description: "Appointments that fit your life.", images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
