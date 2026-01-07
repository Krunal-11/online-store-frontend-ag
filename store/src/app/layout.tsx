import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context";
import { MainLayout } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "New Guru Enterprises",
  description: "Wide Range of home appliances and kitchenware - Home delivery available",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
