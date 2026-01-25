import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

export const metadata: Metadata = {
  title: "Dandeal Logistics & Importation",
  description: "Dandeal Logistics & Importation",
  // generator: "v0.app",
  icons: {
    icon: "/dandeal-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ConvexClientProvider>
          <SessionProvider>
            {children}
          </SessionProvider>
        </ConvexClientProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
