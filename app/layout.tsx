import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
const pf = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--font-dm" });
export const viewport: Viewport = { width: "device-width", initialScale: 1 };
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "F.S Casting | Jewellery Design, Gold Casting & RP Design, Karachi", template: "%s | F.S Casting" },
  description: "Premium jewellery designs, gold casting and RP / 3D design from F.S Casting, Karachi, Pakistan.",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${pf.variable} ${dm.variable}`}><body>{children}</body></html>;
}
