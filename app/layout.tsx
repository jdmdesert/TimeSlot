import type { Metadata } from "vinext/shims/metadata";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "timeslot.app";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title: "Time Slot — Book your next look",
    description: "A modern appointment booking platform for barbers, stylists, and beauty professionals.",
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/desktop-icon-192.png", sizes: "192x192", type: "image/png" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    openGraph: {
      title: "Time Slot — Book your next look",
      description: "Appointments that fit your life.",
      type: "website",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: "Time Slot — Book your next look." }],
    },
    twitter: { card: "summary_large_image", title: "Time Slot — Book your next look", description: "Appointments that fit your life.", images: [imageUrl] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
