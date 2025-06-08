import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./tailwind.css";
import "./index.css";
import React from "react";
import { Toaster } from "react-hot-toast";
import { PWAPrompt } from "./components/shared/pwa-prompt";
import { useMobileOptimizations } from "./hooks/use-mobile-optimizations";

export const meta: MetaFunction = () => [
  { title: "OpenHands - AI Software Engineer" },
  { name: "description", content: "OpenHands: Code Less, Make More. An AI-powered software engineer that can help you build, debug, and deploy applications." },
  
  // PWA and Mobile Meta Tags
  { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" },
  { name: "mobile-web-app-capable", content: "yes" },
  { name: "apple-mobile-web-app-capable", content: "yes" },
  { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
  { name: "apple-mobile-web-app-title", content: "OpenHands" },
  { name: "application-name", content: "OpenHands" },
  { name: "msapplication-TileColor", content: "#0c0e10" },
  { name: "theme-color", content: "#0c0e10" },
  
  // PWA Manifest
  { rel: "manifest", href: "/manifest.webmanifest" },
  
  // Apple Touch Icons
  { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
  { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
  
  // Favicon
  { rel: "icon", href: "/favicon.ico" },
  { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
  { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
  
  // Safari Pinned Tab
  { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#0c0e10" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster />
        <PWAPrompt />
      </body>
    </html>
  );
}



export default function App() {
  // Initialize mobile optimizations
  useMobileOptimizations();

  return <Outlet />;
}
