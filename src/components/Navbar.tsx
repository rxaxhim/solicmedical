'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, Mail, Search, ChevronRight, Clock } from 'lucide-react';
import SearchModal from './SearchModal';

const links = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/support', label: 'Technical Support' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cmd/Ctrl+K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── Top utility strip — light tint, like the original site ── */}
      <div className="hidden border-b border-navy-100 bg-gradient-to-r from-navy-100 via-navy-50 to-white md:block">
        <div className="container-x flex h-9 items-center justify-between text-xs text-navy-700">
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-accent-600" />
            Mon–Fri · 9am–5pm ET
          </p>
          <div className="flex items-center gap-5">
            <a
              href="tel:+14167408885"
              className="flex items-center gap-2 font-semibold transition-colors hover:text-accent-600"
            >
              <Phone className="h-3.5 w-3.5 text-accent-600" />
              +1 416-740-8885
            </a>
            <span className="h-3.5 w-px bg-navy-200" />
            <a
              href="mailto:info@solicmedical.com"
              className="flex items-center gap-2 font-semibold transition-colors hover:text-accent-600"
            >
              <Mail className="h-3.5 w-3.5 text-accent-600" />
              info@solicmedical.com
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 overflow-hidden border-b border-border bg-white transition-shadow ${
          scrolled ? 'shadow-card' : ''
        }`}
      >
        <nav className="container-x relative flex h-20 items-center justify-between">
          {/* Logo. `self-stretch` makes this the full navbar height so the
              angled panel below can span it. */}
          <Link href="/" className="relative flex items-center gap-2.5 self-stretch">
            {/* Angled brand panel — the original site's signature, with a crisp
                orange edge running along the diagonal. Anchored to this link
                rather than to a share of the viewport, so the diagonal always
                clears the wordmark by the same gap at every screen width: the
                right edge sits 104px past the text, and the clip-path pulls the
                top of the diagonal back 72px of that, leaving a 32px gap.
                Only from xl up: below 1280px the wordmark runs straight into
                the nav links, so the diagonal has nowhere to land. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-[100vw] -right-[104px] hidden xl:block"
            >
              {/* orange sliver, revealed along the diagonal by the panel on top */}
              <div
                className="absolute inset-0 translate-x-[6px] bg-accent-500"
                style={{ clipPath: 'polygon(0 0, calc(100% - 72px) 0, 100% 100%, 0 100%)' }}
              />
              {/* The panel bleeds a full viewport to the left, so the gradient
                  is pinned to a fixed 400px span at the right edge and the
                  base colour fills the rest — otherwise it stretches across
                  the bleed and washes out to nothing. 400px keeps the ramp
                  inside the panel at every width, so the tone reads the same
                  at 1280 as it does at 2560. */}
              <div
                className="absolute inset-0 bg-navy-300 bg-gradient-to-r from-navy-300 via-navy-200 to-navy-100 bg-[length:400px_100%] bg-right bg-no-repeat"
                style={{ clipPath: 'polygon(0 0, calc(100% - 72px) 0, 100% 100%, 0 100%)' }}
              />
            </div>
            <div className="relative h-[52px] w-[98px]">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/logo-mark.png`}
                alt="Solic Medical"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="relative font-display text-2xl font-bold tracking-tight text-navy-800">
              Solic Medical
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative block px-3.5 py-2 font-display text-base font-semibold transition-colors duration-200 ${
                      active
                        ? 'text-navy-900'
                        : 'text-navy-800 hover:text-accent-600'
                    }`}
                  >
                    {l.label}
                    {/* orange bar marks the page you're on; slides in on hover */}
                    <span
                      className={`absolute inset-x-3 bottom-1 h-[3px] origin-left rounded-full bg-accent-500 transition-transform duration-200 ${
                        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-navy-600 transition-colors hover:text-accent-600"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-5 py-2.5 font-display text-sm font-semibold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-card-hover"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-navy-800"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-navy-800"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="border-t border-border bg-white lg:hidden">
            <ul className="container-x flex flex-col py-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 font-display text-base font-medium text-navy-800 transition-colors hover:text-accent-600"
                  >
                    {l.label}
                    <ChevronRight className="h-4 w-4 text-navy-400" />
                  </Link>
                </li>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-3"
              >
                Contact Us
              </Link>

              {/* Contact details (the old top bar lived here on larger screens) */}
              <li className="mt-5 flex flex-col gap-3 border-t border-border pt-4 text-sm text-navy-600">
                <a
                  href="tel:+14167408885"
                  className="flex items-center gap-2 hover:text-accent-600"
                >
                  <Phone className="h-4 w-4 text-navy-400" />
                  +1 416-740-8885
                </a>
                <a
                  href="mailto:info@solicmedical.com"
                  className="flex items-center gap-2 hover:text-accent-600"
                >
                  <Mail className="h-4 w-4 text-navy-400" />
                  info@solicmedical.com
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
