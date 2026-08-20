import type {
    Metadata,
  } from "next";
  
  import {
    Geist,
  } from "next/font/google";
  
  import {
    Providers,
  } from "@/providers";
  
  import {
    cn,
  } from "@/lib/utils";
  
  import "./globals.css";
  
  const geist = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
  });
  
  export const metadata: Metadata = {
    title: "Klugance School Admin",
    description:
      "Klugance School Administration",
  };
  
  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html
        lang="en"
        className={cn(
          "font-sans",
          geist.variable,
        )}
      >
        <body>
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    );
  }