"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/providers/client-providers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@repo/ui";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "home" },
  { href: "/about", label: "about" },
  // { href: "/projects", label: "projects" },
  { href: "/blog", label: "blog" },
  { href: "/contact", label: "contact" },
  {
    href: "https://jax.krondor.org",
    label: "jax",
    external: true,
  },
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
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('geney-theme') || 'dark';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <ClientProviders>
          <div className="flex flex-col min-h-screen max-w-4xl mx-auto px-6">
            {/* Navigation */}
            <nav className="w-full py-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 sm:gap-0">
                <Link
                  href="/"
                  className="text-foreground hover:opacity-80 transition-opacity"
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 174.65 175.03"
                    fill="currentColor"
                    aria-label="Logo"
                  >
                    <g transform="translate(-13.056684,-68.409081)">
                      <rect
                        width="48.527336"
                        height="48.527336"
                        x="18.056684"
                        y="131.47522"
                      />
                      <rect
                        width="48.527336"
                        height="48.527336"
                        x="18.034792"
                        y="189.16695"
                      />
                      <rect
                        width="48.527336"
                        height="48.527336"
                        x="18.077982"
                        y="73.409081"
                      />
                      <rect
                        width="48.527336"
                        height="48.527336"
                        x="134.11662"
                        y="73.262489"
                      />
                      <rect
                        width="48.527336"
                        height="48.527336"
                        x="134.17912"
                        y="189.9072"
                      />
                      <rect
                        width="48.527336"
                        height="48.527336"
                        x="76.062668"
                        y="131.47395"
                      />
                    </g>
                  </svg>
                </Link>
                <ul className="flex gap-3 sm:gap-6">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      {item.external ? (
                        <a
                          href={item.href}
                          className="text-sm transition-colors hover:text-primary text-muted-foreground"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={cn(
                            "text-sm transition-colors hover:text-primary",
                            pathname === item.href
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <main className="flex-grow mb-12">{children}</main>

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
