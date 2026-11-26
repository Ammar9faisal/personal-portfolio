import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "The Inventor's Workshop | Ammar Faisal", description: "Ammar Faisal's interactive engineering workshop and software portfolio" };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {return <html lang="en"><body>{children}</body></html>}
