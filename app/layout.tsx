import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
  return <html lang="en"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
