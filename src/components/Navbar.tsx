'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Menu, X, Phone, Mail, Search, ChevronRight } from 'lucide-react';
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
      {/* Top contact bar */}
      <div className="hidden border-b border-border bg-muted md:block">
        <div className="container-x flex h-10 items-center justify-between text-xs">
          <p className="text-navy-500">
            Trusted Canadian medical equipment supplier since 2011
          </p>
          <div className="flex items-center gap-6 text-navy-600">
            <a
              href="tel:+14167408885"
              className="flex items-center gap-1.5 hover:text-navy-800"
            >
              <Phone className="h-3 w-3" />
              +1 416-740-8885
            </a>
            <a
              href="mailto:info@solicmedical.com"
              className="flex items-center gap-1.5 hover:text-navy-800"
            >
              <Mail className="h-3 w-3" />
              info@solicmedical.com
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 border-b border-border bg-white transition-shadow ${
          scrolled ? 'shadow-card' : ''
        }`}
      >
        <nav className="container-x flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-[52px] w-[98px]">
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/logo-mark.png`}
                alt="Solic Medical"
                fill
                priority
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-navy-800">
              Solic Medical
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-2 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="px-3.5 py-2 text-base font-medium text-navy-700 transition-colors hover:text-accent-600"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-navy-600 hover:text-navy-900"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-navy-800 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700"
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
                    className="flex items-center justify-between py-3 text-base font-medium text-navy-800 transition-colors hover:text-accent-600"
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
            </ul>
          </div>
        )}
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
