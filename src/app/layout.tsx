import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blood Donation Camp - Save Lives, Donate Blood",
  description: "Register for our blood donation camp. Your single donation can save up to 3 lives. Join us in our mission to save lives through blood donation.",
  keywords: ["Blood Donation", "Donate Blood", "Save Lives", "Blood Camp", "Blood Bank", "Healthcare"],
  authors: [{ name: "Blood Donation Camp Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Blood Donation Camp",
    description: "Save Lives, Donate Blood - Register Now",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
