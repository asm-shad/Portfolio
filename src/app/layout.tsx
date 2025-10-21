import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Portfolio Home Page",
  description: "Showing profile of ASM Shad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster richColors position="top-center" />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
