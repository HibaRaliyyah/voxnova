import { Inter, Outfit } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import "./globals.css";
import Provider from "./provider";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "VoxNova",
  description: "AI Powered Voice Agent",
  icons: {
    icon: "/favicon.svg",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <Provider>
              {children}
              <ToastContainer />
            </Provider>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
