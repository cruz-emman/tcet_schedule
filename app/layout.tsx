import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootProvider from "@/components/providers/RootProvider";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TCET Appointment System",
  description: "TCET website",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>

          <RootProvider>
            {children}
            <Toaster richColors />
          </RootProvider>
        </body>
      </html>

    </SessionProvider>

  );
}
