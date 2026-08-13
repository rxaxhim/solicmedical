import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  FileText,
  Headphones,
  Wrench,
  Phone,
  Mail,
  Clock,
  Shield,
  PackageSearch,
  AlertCircle,
} from 'lucide-react';

const supportTopics = [
  {
    icon: Wrench,
    title: 'Equipment installation & setup',
    desc: 'Guidance for new equipment, including assembly, calibration, and initial run-throughs.',
  },
  {
    icon: PackageSearch,
    title: 'Replacement parts & accessories',
    desc: 'Identify and order the right parts, cuffs, batteries, or consumables for your equipment.',
  },
  {
    icon: FileText,
    title: 'Manuals & documentation',
    desc: 'Access user manuals, datasheets, and care instructions for any product we supply.',
  },
  {
    icon: Shield,
    title: 'Warranty claims',
    desc: 'Manufacturer warranty support and claim processing for eligible equipment.',
  },
  {
    icon: AlertCircle,
    title: 'Troubleshooting',
    desc: 'Equipment not behaving as expected? We will help diagnose the issue.',
  },
  {
    icon: Headphones,
    title: 'General product advice',
    desc: 'Not sure which product fits your practice? Our team has the experience to guide you.',
  },
];

const faqs = [
  {
    q: 'How quickly do you respond to support requests?',
    a: 'During business hours (Mon–Fri, 9am–5pm ET), we typically respond within a few hours. Urgent requests are prioritized.',
  },
  {
    q: 'Do you offer on-site service?',
    a: 'For larger equipment and specific manufacturers, on-site service can be arranged. Reach out to our team to discuss options for your equipment.',
  },
  {
    q: 'Can I get a replacement part for an old Solic order?',
    a: 'Yes. Even for orders placed years ago, we can usually source the right replacement part. We will need the original product info or photos to get started.',
  },
  {
    q: 'Is there a charge for technical support?',
    a: 'Initial support and product guidance are free of charge. Specialty services like on-site repair may incur fees, which we will always quote upfront.',
  },
  {
    q: 'What information should I have ready when contacting support?',
    a: 'The product name or model number, approximate purchase date, and a brief description of the issue (with photos if possible) will help us resolve your issue faster.',
  },
];

export default function SupportPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-navy-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=2000&q=80&auto=format&fit=crop"
            alt="Healthcare technician supporting equipment"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50" />
        </div>
        <div className="container-x relative py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="eyebrow-light">Technical Support</p>
            <h1 className="mt-6 text-display-xl lg:text-display-2xl text-white">
              Real <span className="text-accent-500">support</span> from real people
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100 lg:text-xl">
              Whether it is an installation question, a missing part, or a piece
              of equipment acting up, our team is ready to help.
            </p>
          </div>
        </div>
      </section>

      {/* QUICK CONTACT */}
      <section className="border-b border-border bg-white py-16">
        <div className="container-x">
          <div className="grid gap-5 md:grid-cols-3">
            <a
              href="tel:+14167408885"
              className="group flex items-center gap-4 rounded-lg border border-border bg-white p-6 transition-all hover:border-navy-300 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                <Phone className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Phone
                </p>
                <p className="mt-1 font-semibold text-navy-900">+1 416-740-8885</p>
              </div>
              <ArrowRight className="h-4 w-4 text-navy-400 transition-transform group-hover:translate-x-0.5" />
            </a>
            <Link
              href="/contact?intent=support"
              className="group flex items-center gap-4 rounded-lg border border-border bg-white p-6 transition-all hover:border-navy-300 hover:shadow-card-hover"
            >
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                <Mail className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Email
                </p>
                <p className="mt-1 font-semibold text-navy-900">
                  Send us a message
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-navy-400 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="flex items-center gap-4 rounded-lg border border-border bg-muted p-6">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                <Clock className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Hours
                </p>
                <p className="mt-1 font-semibold text-navy-900">
                  Mon–Fri · 9am–5pm ET
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE HELP WITH */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <div className="mb-14 max-w-2xl">
            <p className="eyebrow">What we help with</p>
            <h2 className="mt-4 text-display-lg text-navy-900">
              Support across the entire equipment lifecycle
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {supportTopics.map((t) => (
              <div
                key={t.title}
                className="rounded-lg border border-border bg-white p-7 transition-all hover:border-navy-300 hover:shadow-card-hover"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-navy-50 text-navy-700">
                  <t.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-navy-900">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — FULL-BLEED with image */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[640px]">
            <Image
              src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1600&q=80&auto=format&fit=crop"
              alt="Support team at work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex items-center bg-muted px-6 py-20 lg:px-16 lg:py-24">
            <div className="max-w-xl">
              <p className="eyebrow">How it works</p>
              <h2 className="mt-4 text-display-lg text-navy-900">
                A simple, three-step process
              </h2>
              <div className="mt-10 space-y-8">
                {[
                  {
                    n: '01',
                    title: 'Reach out',
                    desc: 'Call us, email, or use the contact form. Include your product info and a brief description of the issue.',
                  },
                  {
                    n: '02',
                    title: 'We diagnose and propose',
                    desc: 'We respond with next steps: a replacement part, a manual, a manufacturer escalation, or a service visit.',
                  },
                  {
                    n: '03',
                    title: 'You get back to work',
                    desc: 'We follow through until the issue is resolved. You are not on your own once the box arrives.',
                  },
                ].map((s) => (
                  <div key={s.n} className="flex gap-5">
                    <p className="text-2xl font-bold text-accent-600">{s.n}</p>
                    <div>
                      <h3 className="text-lg font-semibold text-navy-900">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-navy-600">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-4 text-display-lg text-navy-900">
                Common questions
              </h2>
              <p className="mt-6 text-navy-600">
                Do not see your question here? Reach out and we will be happy
                to help.
              </p>
            </div>
            <div className="lg:col-span-8">
              <div className="divide-y divide-border rounded-lg border border-border bg-white">
                {faqs.map((f) => (
                  <details key={f.q} className="group p-6">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-navy-900">
                      {f.q}
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-md border border-border text-navy-500 transition-all group-open:rotate-45 group-open:border-navy-800 group-open:bg-navy-800 group-open:text-white">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-navy-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900">
        <div className="container-x py-20 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow-light">Need more help?</p>
              <h2 className="mt-4 text-display-lg text-white">
                Send us a message
              </h2>
              <p className="mt-4 max-w-lg text-lg text-navy-100">
                A member of our team will get back to you the same business day.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact" className="btn-light">
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
