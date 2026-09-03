import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

const groups = [
  {
    title: 'Company',
    items: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Technical Support', href: '/support' },
    ],
  },
  {
    title: 'Products',
    items: [
      { label: 'Tables & Stools', href: '/products' },
      { label: 'Phlebotomy', href: '/products' },
      { label: 'Lights', href: '/products' },
      { label: 'Trolleys & Carts', href: '/products' },
      { label: 'View All', href: '/products' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Product Manuals', href: '/support' },
      { label: 'Warranty Information', href: '/support' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-navy-900 text-white">
      <div className="container-x py-16">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Brand block */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-20 rounded-md bg-white p-1">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/logo.png`}
                  alt="Solic Medical"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div className="leading-tight">
                <span className="block text-lg font-bold text-white">
                  Solic Medical
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.15em] text-navy-300">
                  Equipment Supplier
                </span>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-navy-200">
              A trusted Canadian supplier of medical and surgical equipment for
              clinics, hospitals, and physician offices since 2011.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3 text-navy-200">
                <Phone className="h-4 w-4 text-navy-300" />
                <a href="tel:+14167408885" className="hover:text-white">
                  +1 416-740-8885
                </a>
              </li>
              <li className="flex items-center gap-3 text-navy-200">
                <Mail className="h-4 w-4 text-navy-300" />
                <a href="mailto:info@solicmedical.com" className="hover:text-white">
                  info@solicmedical.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-navy-200">
                <MapPin className="mt-0.5 h-4 w-4 text-navy-300" />
                <span>Toronto, Ontario, Canada</span>
              </li>
            </ul>
          </div>

          {/* Link columns — kept in their own grid so they sit closer together */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
              {groups.map((g) => (
                <div key={g.title}>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
                    {g.title}
                  </h4>
                  <ul className="mt-5 space-y-3">
                    {g.items.map((it) => (
                      <li key={it.label}>
                        <Link
                          href={it.href}
                          className="text-sm text-navy-200 transition-colors hover:text-white"
                        >
                          {it.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Hours block */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-white">
                  Business Hours
                </h4>
                <ul className="mt-5 space-y-2 text-sm text-navy-200">
                  <li className="flex justify-between gap-3">
                    <span>Mon–Fri</span>
                    <span className="text-navy-300">9am–5pm</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Saturday</span>
                    <span className="text-navy-300">Closed</span>
                  </li>
                  <li className="flex justify-between gap-3">
                    <span>Sunday</span>
                    <span className="text-navy-300">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-navy-700 pt-6 text-xs text-navy-300 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Solic Medical Equipment. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/disclaimer" className="hover:text-white">Disclaimer</Link>
            <Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
