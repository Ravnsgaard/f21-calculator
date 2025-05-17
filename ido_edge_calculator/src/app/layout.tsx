import "../styles/globals.css";
import { ReactNode } from "react";
import { Providers } from "../components/Providers";
import { sourceSans } from "../theme";
export const metadata = { title: "IDO Edge Cost Calculator" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={sourceSans.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
