import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  HeadphonesIcon,
  CheckCircle2,
  Activity,
  Heart,
  Baby,
  BedDouble,
  Stethoscope,
  PawPrint,
  Package,
} from 'lucide-react';
import UltrasoundProbe from '@/components/icons/UltrasoundProbe';

const categories = [
  { name: 'Patient Monitoring', slug: 'patient-monitoring', icon: Activity },
  { name: 'Cardio Diagnostics', slug: 'cardio-diagnostics', icon: Heart },
  { name: 'OB & GYN', slug: 'ob-gyn', icon: Baby },
  { name: 'Exam Room Furniture', slug: 'exam-room-furniture', icon: BedDouble },
  { name: 'Ultrasounds', slug: 'ultrasounds', icon: UltrasoundProbe },
  { name: 'ENT', slug: 'ent', icon: Stethoscope },
  { name: 'Animal Care', slug: 'animal-care', icon: PawPrint },
  { name: 'Others', slug: 'others', icon: Package },
];

export default function HomePage() {
  return (
    <>
      {/* ────────────────────────── HERO ────────────────────────── */}
      <section className="relative bg-navy-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=2000&q=80&auto=format&fit=crop"
            alt="Clinician using patient monitoring equipment in a clinical setting"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/40" />
        </div>

        <div className="container-x relative py-16 lg:py-24">
          <div className="max-w-3xl">
            <p className="eyebrow-light">Medical & Surgical Equipment Supplier</p>
            <h1 className="mt-6 text-display-xl lg:text-display-2xl text-white">
              Trusted <span className="text-accent-500">medical equipment</span> for Canadian healthcare
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-navy-100 lg:text-xl">
              Solic Medical is a Toronto-based supplier of medical, surgical,
              and diagnostic equipment, serving clinics, hospitals, and physician
              offices across Canada since 2011.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/products" className="btn-light">
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-ghost-light">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* ────────────────────────── CATEGORIES (image grid) ────────────────────────── */}
      <section className="bg-white pb-14 pt-20 lg:pb-16 lg:pt-28">
        <div className="container-x">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h2 className="text-display-lg text-navy-900">
                Browse by Category
              </h2>
              <p className="mt-4 text-navy-600">
                Browse our full catalogue across patient monitoring, diagnostics,
                exam room furniture, and more.
              </p>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-accent-600"
            >
              View all categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.name}
                  href={`/products?category=${c.slug}`}
                  className="group flex flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-navy-600 via-navy-800 to-navy-900 px-6 py-9 text-center ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:from-navy-500 hover:via-navy-700 hover:to-navy-800 hover:shadow-card-hover hover:ring-accent-500/50"
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 transition-colors group-hover:bg-accent-500/20 group-hover:ring-accent-500/40">
                    <Icon className="h-11 w-11 text-accent-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{c.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors group-hover:text-accent-500">
                    Browse now
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────────────────────────── INTRO BAND ────────────────────────── */}
      <section className="bg-muted py-14 lg:py-16">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow">A trusted partner</p>
              <h2 className="mt-5 text-display-lg text-navy-900">
                Equipping Canadian healthcare practices for over a decade
              </h2>
            </div>
            <div className="lg:col-span-7 lg:pl-12">
              <p className="text-lg leading-relaxed text-navy-600">
                We supply hospitals, clinics, family practices, and specialty
                centres with carefully selected medical, surgical, and
                diagnostic equipment from manufacturers we trust. From a single
                stethoscope to a fully outfitted examination room, we are here
                to help.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-navy-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-500" />
                  Health Canada compliant
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-500" />
                  Direct manufacturer relationships
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent-500" />
                  Nationwide delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── FULL-BLEED IMAGE BAND ────────────────────────── */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[440px]">
            <Image
              src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1600&q=80&auto=format&fit=crop"
              alt="Medical professionals consulting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex items-center bg-white px-6 py-12 lg:px-14 lg:py-14">
            <div className="max-w-xl">
              <p className="eyebrow">Why Solic</p>
              <h2 className="mt-3 text-display-md text-navy-900">
                Built on trust. Backed by service.
              </h2>
              <p className="mt-4 text-navy-600">
                In a market full of generic suppliers, we set ourselves apart
                with personal service, deep product knowledge, and a commitment
                to standing behind every order we ship.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  {
                    title: 'Real people, real answers',
                    desc: 'When you call, you reach a person who knows the products and your account.',
                  },
                  {
                    title: 'Direct from manufacturer',
                    desc: 'We work directly with trusted manufacturers, so you get fair pricing without the markup.',
                  },
                  {
                    title: 'Service after the sale',
                    desc: 'Replacement parts, troubleshooting, and warranty support — even years after delivery.',
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-4">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-none text-accent-500" />
                    <div>
                      <p className="font-semibold text-navy-900">{item.title}</p>
                      <p className="mt-1 text-sm text-navy-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <Link href="/about" className="btn-primary">
                  Learn more about us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────── REVERSED FULL-BLEED IMAGE BAND ────────────────────────── */}
      <section className="bg-muted">
        <div className="grid lg:grid-cols-2">
          <div className="order-2 flex items-center bg-muted px-6 py-12 lg:order-1 lg:px-14 lg:py-14">
            <div className="max-w-xl">
              <p className="eyebrow">Technical Support</p>
              <h2 className="mt-3 text-display-md text-navy-900">
                Support throughout the equipment lifecycle
              </h2>
              <p className="mt-4 text-navy-600">
                From installation guidance to replacement parts and warranty
                claims, our team is here long after your equipment arrives. We
                stand by every product we supply.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { icon: ShieldCheck, label: 'Warranty support' },
                  { icon: HeadphonesIcon, label: 'Real-person service' },
                  { icon: Truck, label: 'Parts & accessories' },
                  { icon: CheckCircle2, label: 'Installation guidance' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-md border border-border bg-white p-4"
                  >
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                    </div>
                    <p className="text-sm font-semibold text-navy-900">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-7">
                <Link href="/support" className="btn-primary">
                  Visit Technical Support
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
          <div className="relative order-1 aspect-[4/3] lg:order-2 lg:aspect-auto lg:min-h-[440px]">
            <Image
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&q=80&auto=format&fit=crop"
              alt="Healthcare technician supporting equipment"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────── CTA BAND ────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?w=2000&q=80&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/60" />
        </div>
        <div className="container-x relative py-20 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow-light">Get in touch</p>
              <h2 className="mt-4 text-display-lg text-white">
                Ready to equip your practice?
              </h2>
              <p className="mt-5 max-w-xl text-lg text-navy-100">
                Tell us what you need. We respond to all inquiries within one
                business day with options, pricing, and lead times.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact" className="btn-light">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="tel:+14167408885" className="btn-ghost-light">
                Call +1 416-740-8885
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
