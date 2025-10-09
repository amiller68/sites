"use client";

import { Roboto_Mono, VT323 } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/providers/client-providers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

const navItems = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  // { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${robotoMono.variable} ${vt323.variable}`}
    >
      <body className="font-roboto-mono">
        <ClientProviders>
          <div className="flex flex-col min-h-screen max-w-4xl mx-auto px-6">
            {/* Navigation */}
            <nav className="w-full py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 sm:gap-0">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                  <img src="/icon.svg" alt="Logo" className="w-8 h-8" />
                </Link>
                <ul className="flex gap-3 sm:gap-6">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "text-sm font-roboto-mono transition-colors hover:text-primary",
                          pathname === item.href
                            ? "text-primary font-semibold"
                            : "text-foreground",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <main className="flex-grow">{children}</main>

            {/* Footer */}
            <footer className="mt-auto border-t border-border">
              <div className="py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
                  <p>&copy; {currentYear} Krondor Corp</p>
                  <a
                    href="mailto:al@krondor.org"
                    className="hover:text-foreground transition-colors"
                  >
                    al@krondor.org
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
