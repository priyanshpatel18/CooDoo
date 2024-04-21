import siteConfig from "@/config/siteConfig";
import "./globals.css";
import Providers from "@/providers/Providers";
import Navbar from "@/components/Navbar";
import { fontPoppins } from "@/fonts/fonts";

export const metadata = siteConfig;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fontPoppins}`}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
