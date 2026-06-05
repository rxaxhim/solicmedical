import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Heart,
  Sparkles,
  Users,
} from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Patient-first thinking',
    desc: 'Every product we carry is chosen with the end user in mind: the patient on the table and the clinician beside them.',
  },
  {
    icon: Compass,
    title: 'Honest counsel',
    desc: 'If a product is not right for your practice, we will tell you. Trust is built one straight answer at a time.',
  },
  {
    icon: Sparkles,
    title: 'Quality at fair prices',
    desc: 'We source from manufacturers we trust, then price fairly. No middle-man markup, no surprises.',
  },
  {
    icon: Users,
    title: 'A real team behind every order',
    desc: 'When you call, you reach a person who knows your file. Small enough to care, established enough to deliver.',
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-navy-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=2000&q=80&auto=format&fit=crop"
            alt="Medical equipment in a clinic setting"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50" />
        </div>
        <div className="container-x relative py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="eyebrow-light">About Solic Medical</p>
            <h1 className="mt-6 text-display-xl lg:text-display-2xl text-white">
              A trusted partner for <span className="text-accent-500">Canadian healthcare</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100 lg:text-xl">
              Solic Medical is a Toronto-based supplier of medical and surgical
              equipment, serving clinics, hospitals, and physician offices
              across Canada since 2011.
            </p>
          </div>
        </div>
      </section>

      {/* STORY — IMAGE LEFT, TEXT RIGHT (full-bleed) */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[640px]">
            <Image
              src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&q=80&auto=format&fit=crop"
              alt="Medical professionals at work"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="flex items-center bg-white px-6 py-20 lg:px-16 lg:py-24">
            <div className="max-w-xl">
              <p className="eyebrow">Our story</p>
              <h2 className="mt-4 text-display-lg text-navy-900">
                Built one relationship at a time
              </h2>
              <div className="mt-6 space-y-5">
                <p className="text-lg leading-relaxed text-navy-700">
                  When Solic Medical Equipment was founded in 2011, the goal
                  was straightforward: build a supplier Canadian practices
                  could rely on without second-guessing.
                </p>
                <p className="leading-relaxed text-navy-600">
                  The medical equipment industry can feel impersonal. Big
                  catalogues, slow responses, generic answers. We wanted to be
                  the opposite: a team small enough that every order matters,
                  with deep enough product knowledge that you are never sent
                  in circles.
                </p>
                <p className="leading-relaxed text-navy-600">
                  Over a decade later, we have earned the trust of clinics
                  across the country by sticking to the basics: quality
                  equipment, fair pricing, real support, and shipments that
                  arrive when we say they will.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-muted py-20 lg:py-28">
        <div className="container-x">
          <div className="mb-14 max-w-2xl">
            <p className="eyebrow">What we stand for</p>
            <h2 className="mt-4 text-display-lg text-navy-900">
              Four things we will not compromise on
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-lg border border-border bg-white p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-navy-50 text-navy-700">
                  <v.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-navy-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE SERVE — TEXT LEFT, IMAGE RIGHT */}
      <section className="bg-white">
        <div className="grid lg:grid-cols-2">
          <div className="order-2 flex items-center bg-white px-6 py-20 lg:order-1 lg:px-16 lg:py-24">
            <div className="max-w-xl">
              <p className="eyebrow">Who we serve</p>
              <h2 className="mt-4 text-display-lg text-navy-900">
                Practices that value reliability
              </h2>
              <p className="mt-6 text-lg text-navy-600">
                From a single-room family practice in northern Ontario to a
                multi-site surgical centre in downtown Toronto, our customers
                share one thing: they want a supplier they can trust to
                deliver, every time.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  'Family medicine and general practices',
                  'Specialty clinics — dermatology, OB-GYN, paediatrics',
                  'Hospitals and surgical centres',
                  'Phlebotomy and diagnostic laboratories',
                  'Physiotherapy, chiropractic, and wellness centres',
                  'Long-term care facilities',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-accent-500" />
                    <span className="text-navy-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="relative order-1 aspect-[4/3] lg:order-2 lg:aspect-auto lg:min-h-[640px]">
            <Image
              src="https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?w=1600&q=80&auto=format&fit=crop"
              alt="Modern clinic interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900">
        <div className="container-x py-20 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow-light">Get in touch</p>
              <h2 className="mt-4 text-display-lg text-white">
                Ready to outfit your practice?
              </h2>
              <p className="mt-4 max-w-lg text-lg text-navy-100">
                Whether you are setting up a new clinic or restocking a trusted
                favourite, our team is ready to help.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/contact" className="btn-light">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/products" className="btn-ghost-light">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
