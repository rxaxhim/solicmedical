'use client';

import { Suspense, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Check,
} from 'lucide-react';

// Maps the ?intent= param from product / support links to a Subject option.
function subjectFromIntent(intent: string | null): string {
  if (intent === 'support') return 'Technical Support';
  if (intent === 'info' || intent === 'quote') return 'Product Question';
  return 'General Inquiry';
}

function buildMessage(intent: string | null, product: string, code: string) {
  if (!product) return '';
  const ref = code ? `${product} (model ${code})` : product;
  return `I would like more information about the ${ref}.`;
}

function ContactPage() {
  const searchParams = useSearchParams();
  const intent = searchParams.get('intent');
  const product = searchParams.get('product') ?? '';
  const code = searchParams.get('code') ?? '';

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: subjectFromIntent(intent),
    productCode: code,
    message: buildMessage(intent, product, code),
  });

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative bg-navy-900 text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1486825586573-7131f7991bdd?w=2000&q=80&auto=format&fit=crop"
            alt="Office setting"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-900/50" />
        </div>
        <div className="container-x relative py-24 lg:py-32">
          <div className="max-w-3xl">
            <p className="eyebrow-light">Contact</p>
            <h1 className="mt-6 text-display-xl lg:text-display-2xl text-white">
              <span className="text-accent-500">Get in touch</span> with our team
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-100 lg:text-xl">
              Whether you have a single product question or are outfitting an
              entire new clinic, we would love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN GRID */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Contact info */}
            <aside className="space-y-4 lg:col-span-4">
              <div className="rounded-lg border border-border bg-white p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                  Contact information
                </p>
                <ul className="mt-6 space-y-5">
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                        Phone
                      </p>
                      <a
                        href="tel:+14167408885"
                        className="mt-1 block font-semibold text-navy-900 hover:text-accent-600"
                      >
                        +1 416-740-8885
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                        Email
                      </p>
                      <a
                        href="mailto:info@solicmedical.com"
                        className="mt-1 block font-semibold text-navy-900 hover:text-accent-600"
                      >
                        info@solicmedical.com
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                        Address
                      </p>
                      <address className="mt-1 not-italic text-sm leading-relaxed text-navy-900">
                        <span className="font-semibold">Solic Medical</span><br />
                        62 Bartor Road, Unit 1<br />
                        Toronto, ON. M9M 2G5<br />
                        Canada
                      </address>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-md bg-navy-50 text-navy-700">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-navy-500">
                        Business hours
                      </p>
                      <p className="mt-1 font-semibold text-navy-900">
                        Mon–Fri · 9am–5pm ET
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

            </aside>

            {/* Form */}
            <div className="lg:col-span-8">
              <div className="rounded-lg border border-border bg-white p-8 md:p-10">
                <p className="eyebrow">Send a message</p>
                <h2 className="mt-3 text-display-sm text-navy-900">
                  How can we help?
                </h2>

                <form onSubmit={onSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={onChange}
                      placeholder="Dr. Jane Smith"
                    />
                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={onChange}
                      placeholder="jane@clinic.com"
                    />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <Field
                      label="Clinic / Company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={onChange}
                      placeholder="Smith Family Clinic"
                    />
                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="(416) 555-0100"
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold uppercase tracking-wider text-navy-700"
                      >
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={form.subject}
                        onChange={onChange}
                        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-navy-900 transition-colors focus:border-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-100"
                      >
                        <option>General Inquiry</option>
                        <option>Product Question</option>
                        <option>Technical Support</option>
                        <option>Partnership / Wholesale</option>
                      </select>
                    </div>

                    <Field
                      label="Product code"
                      name="productCode"
                      type="text"
                      value={form.productCode}
                      onChange={onChange}
                      placeholder="e.g. AYR1009"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-xs font-semibold uppercase tracking-wider text-navy-700"
                    >
                      Message <span className="text-accent-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={form.message}
                      onChange={onChange}
                      rows={5}
                      placeholder="Tell us what you are looking for…"
                      className="mt-2 w-full resize-none rounded-md border border-border bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 transition-colors focus:border-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-100"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitted}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-semibold transition-colors sm:w-auto ${
                        submitted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-navy-800 text-white hover:bg-navy-700'
                      }`}
                    >
                      {submitted ? (
                        <>
                          <Check className="h-4 w-4" />
                          Message sent
                        </>
                      ) : (
                        <>
                          Send message
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPageWrapper() {
  return (
    <Suspense fallback={null}>
      <ContactPage />
    </Suspense>
  );
}

function Field({
  label,
  name,
  type,
  required,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-semibold uppercase tracking-wider text-navy-700"
      >
        {label} {required && <span className="text-accent-600">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-border bg-white px-4 py-3 text-sm text-navy-900 placeholder:text-navy-400 transition-colors focus:border-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-100"
      />
    </div>
  );
}
