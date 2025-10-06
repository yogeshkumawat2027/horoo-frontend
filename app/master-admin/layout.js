import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import AuthWrapper from "../../components/AuthWrapper";
import AdminLayoutContent from "../../components/AdminLayoutContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Horoo Admin Panel",
  description: "Master Admin Panel for Horoo Property Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthWrapper>
          <AdminLayoutContent>
            {children}
          </AdminLayoutContent>
        </AuthWrapper>
      </body>
    </html>
  );
}
