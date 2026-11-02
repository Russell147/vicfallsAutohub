import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader } from "@/components/SiteShell";
import { ChatAssistant } from "@/components/ChatAssistant";

export const metadata: Metadata = {
  title: {
    default: "Autohub | Buy and sell cars in Zimbabwe",
    template: "%s | Autohub",
  },
  description:
    "Browse cars from dealers and private owners across Zimbabwe. Contact sellers directly and make deals in person.",
  icons: { icon: "/zim-car-sale-logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <ChatAssistant />
      </body>
    </html>
  );
}
