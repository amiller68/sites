"use client";

import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "home" },
  { href: "/tracks", label: "tracks" },
  { href: "/photos", label: "photos" },
];

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function SoundcloudIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M1 18V14.5c0-.28.22-.5.5-.5s.5.22.5.5V18c0 .28-.22.5-.5.5S1 18.28 1 18zm2.5 1V13c0-.28.22-.5.5-.5s.5.22.5.5v6c0 .28-.22.5-.5.5s-.5-.22-.5-.5zm2.5.5V11.5c0-.28.22-.5.5-.5s.5.22.5.5v8c0 .28-.22.5-.5.5s-.5-.22-.5-.5zM8.5 20V10c0-.28.22-.5.5-.5s.5.22.5.5v10c0 .28-.22.5-.5.5s-.5-.22-.5-.5zm2.5.5V8c0-.28.22-.5.5-.5s.5.22.5.5v12.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5zM13 20V6.5c0-.28.22-.5.5-.5s.5.22.5.5V20c0 .28-.22.5-.5.5s-.5-.22-.5-.5zm3.5.5c-.28 0-.5-.22-.5-.5V5a4.5 4.5 0 0 1 4.5 4.5h.5c1.38 0 2.5 1.12 2.5 2.5S22.88 14.5 21.5 14.5H16V20c0 .28-.22.5-.5.5z" />
    </svg>
  );
}

const socials = [
  {
    href: "https://www.instagram.com/alexplain_me",
    icon: InstagramIcon,
    label: "Instagram",
  },
  {
    href: "https://soundcloud.com/alex-plain-565066733",
    icon: SoundcloudIcon,
    label: "SoundCloud",
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="w-full py-6">
      <div className="flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="text-xl">
          alex plain
        </a>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6">
            {links.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                  <a
                    href={link.href}
                    className={`text-sm transition-colors ${
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-3">
            {socials.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.label}
              >
                <link.icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
