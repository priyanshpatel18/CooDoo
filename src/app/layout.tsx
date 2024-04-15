import siteConfig from "@/config/siteConfig";
import "./globals.css";
import Providers from "@/providers/Providers";
import Navbar from "@/components/Navbar";

export const metadata = siteConfig;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
