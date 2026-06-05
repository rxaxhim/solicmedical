import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer | Solic Medical Equipment',
  description:
    'Read the disclaimer governing the use of materials, information, copyright, and limitation of liability on the Solic Medical Equipment website.',
};

const sections = [
  {
    title: 'Disclaimer',
    body: (
      <>
        <p className="text-navy-600 leading-relaxed">
          All texts, drawings, pictures, designs, data, opinions, suggestions, web pages or links,
          etc. ("materials and information") are for reference only. Not everything may be Health
          Canada approved.
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          Solic Medical gives no warranty or guarantee of the accuracy, completeness, sufficiency,
          timeliness, or reliability of the materials and information on the website, and is not
          liable for any error, mistake, or omission found therein. Any reliance on the materials
          and information on this website shall be at the user's own risk; Solic Medical shall not
          be held liable.
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          Solic Medical reserves the right to revise, update, and delete the materials and
          information on this website at any time without prior notice.
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          We have been very diligent to match product numbers with photos. However, some items may
          not be exactly as shown. Photos shown may include additional accessories or optional parts,
          and colours may also differ. All text and pictures are for reference only and not
          everything may be Health Canada approved.
        </p>
      </>
    ),
  },
  {
    title: 'Copyright',
    body: (
      <>
        <p className="text-navy-600 leading-relaxed">
          Solic Medical owns the copyright to this site and all of its content, including but not
          limited to text, design, pictures, graphics, interfaces and code, documents, and the
          selection and arrangement thereof.
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          No part or whole of any materials and information on the website may be copied,
          reproduced, adapted, translated, released, distributed, photocopied, played, linked, or
          transmitted with super-links, stored in any information retrieval system, or used for any
          commercial purpose — including in any derivative work — without prior written consent of
          Solic Medical.
        </p>
      </>
    ),
  },
  {
    title: 'Limitation of Liability',
    body: (
      <>
        <p className="text-navy-600 leading-relaxed">
          Use of this website is at your sole risk.
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          In no event shall Solic Medical or any other party involved in the creation, production,
          or delivery of the content of this site, or any software application associated with this
          website, be liable for any direct, indirect, special, incidental, consequential, or
          punitive damages of any kind, or damages whatsoever resulting from loss of use, computer
          virus or system failure, or loss of data or profits, arising out of or in connection with
          the use or performance of this website.
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          Solic Medical will not be liable or responsible for any loss or damage caused by or
          arising from your reliance on the content of this site.
        </p>
        <p className="mt-6 rounded-lg border border-border bg-muted px-6 py-4 text-sm font-medium text-navy-700">
          These products are for clinical use only.
        </p>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="border-b border-border bg-muted py-16 lg:py-20">
        <div className="container-x">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 text-display-xl text-navy-900">Disclaimer</h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600">
            Please read this disclaimer carefully before using our website or relying on any
            materials and information contained herein.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-12">
              {sections.map((s, i) => (
                <div
                  key={s.title}
                  className="scroll-mt-24"
                  id={s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-bold tabular-nums text-accent-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-xl font-semibold text-navy-900">{s.title}</h2>
                  </div>
                  <div className="mt-4 pl-8">{s.body}</div>
                  {i < sections.length - 1 && (
                    <div className="mt-12 border-b border-border" />
                  )}
                </div>
              ))}
            </div>

            {/* CONTACT FOOTER */}
            <div className="mt-16 rounded-lg border border-border bg-muted px-8 py-8">
              <h3 className="text-base font-semibold text-navy-900">Questions about this disclaimer?</h3>
              <p className="mt-2 text-sm text-navy-600">
                Reach out to us at{' '}
                <a
                  href="mailto:info@solicmedical.com"
                  className="font-medium text-navy-800 underline underline-offset-2 hover:text-accent-600"
                >
                  info@solicmedical.com
                </a>{' '}
                and we will be happy to help.
              </p>
              <div className="mt-5">
                <Link href="/contact" className="btn-primary">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
