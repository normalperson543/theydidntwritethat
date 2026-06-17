import type { Metadata } from "next";
import "./globals.css";
import { dmSans } from "./lib/fonts";




export const metadata: Metadata = {
  title: "They Didn't Write That!",
  description: "Can you tell AI versus philosopher?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.className} h-full antialiased w-full`}
    >
      <body className="h-full w-full">{children}</body>
    </html>
  );
}
