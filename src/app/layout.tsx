import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/shared/contexts/auth.context";
import RootStyleRegistry from "@/app/mantine";
import "@mantine/core/styles.css";
import "mantine-datatable/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import { Notifications } from "@mantine/notifications";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProviders from "@/services/query.provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EMA",
  description: "EMA Project Management System",
  icons: {
    icon: "/aau.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          <AuthProvider>
            <RootStyleRegistry>
              <Notifications />
              {children}
            </RootStyleRegistry>
          </AuthProvider>
        </QueryProviders>
      </body>
    </html>
  );
}
