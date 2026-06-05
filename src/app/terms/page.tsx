import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Solic Medical Equipment',
  description:
    'Review the terms and conditions governing purchases, invoicing, payments, returns, repairs, and warranties with Solic Medical Equipment.',
};

const sections = [
  {
    title: 'Account Term',
    content:
      'Customers must have a registered account, that is in good standing, in order to purchase products and services from Solic Medical.',
  },
  {
    title: 'Pricing',
    content:
      'Prices are subject to change at any time due to changes in exchange rates, price increases from manufacturers, demand, and/or other factors. All amounts and fees are quoted in CAD and are subject to applicable taxes.',
  },
  {
    title: 'Invoicing',
    content:
      'Purchase orders and/or invoices will be delivered electronically, unless otherwise agreed upon. All invoices are due net thirty (30) days unless otherwise agreed in writing. Interest may be accrued at 1.5% (or the maximum allowed by law, if less) per month on outstanding balances. In addition, the Customer will be responsible for all fees and expenses incurred by Solic Medical in collecting any payments, including, but not limited to, attorneys\' fees and collection costs. Non-payment may result in orders and/or accounts being suspended or cancelled.',
  },
  {
    title: 'Payments',
    body: (
      <>
        <p className="text-navy-600 leading-relaxed">
          The Customer is responsible for providing complete and accurate billing and contact
          information and for notifying us of any changes to such information.
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          Payments made by electronic transfer should be emailed to{' '}
          <a
            href="mailto:ar@solicmedical.com"
            className="font-medium text-navy-800 underline underline-offset-2 hover:text-accent-600"
          >
            ar@solicmedical.com
          </a>
          .
        </p>
        <p className="mt-4 text-navy-600 leading-relaxed">
          Payments made by cheque should be made out to <strong className="text-navy-800">Solic Medical</strong> and
          mailed to:
        </p>
        <address className="mt-4 not-italic rounded-lg border border-border bg-muted px-6 py-5 text-sm text-navy-700 leading-relaxed">
          Solic Medical<br />
          Attention: Accounts Receivable<br />
          62 Bartor Road, Unit 1<br />
          Toronto, ON. M9M 2G5
        </address>
      </>
    ),
  },
  {
    title: 'Delivery',
    content:
      'All orders may be subject to applicable delivery and/or courier fees dependent on the delivery location and delivery type. Customers are required to check and inspect all shipments at the time of delivery and report any order discrepancies within five (5) days of receipt.',
  },
  {
    title: 'Returns & Exchanges',
    content:
      'Some products may be returned for a refund or credit within thirty (30) days of delivery. All returns and exchanges must be approved and accompanied with a Return Merchandise Authorization (RMA) form. A photograph may be required for damaged or defective products in order to begin the RMA process. Eligible items will only be accepted for return if unmarked, undamaged, in original packaging and in a re-salable condition. Damaged products due to improper use, or without original packaging, cannot be returned. A restocking fee may apply. Special order items are non-refundable.',
  },
  {
    title: 'Repairs',
    content:
      'For most items, Solic Medical will assist with coordinating repairs with the manufacturer. Repair timeframes may vary based on parts availability, shipping time, and demand. A Service Order is required prior to shipping items for warranty or repairs. Shipping fees may apply.',
  },
  {
    title: 'Warranty',
    content:
      'Solic Medical will assist the Customer in warranty issues but is not liable. In case of malfunctioning or manufacturing defects, Solic Medical will repair or replace the item within thirty (30) days of purchase. After the thirty (30) day period, the warranty will be covered by the manufacturer under the manufacturer\'s standard terms and conditions. Warranties may vary by product and manufacturer. A Service Order is required prior to shipping items for warranty repairs.',
  },
  {
    title: 'Governing Law',
    content:
      'This Agreement will be governed by and construed in accordance with the laws of the Province of Ontario and the laws of Canada applicable therein.',
  },
];

export default function TermsPage() {
  return (
    <>
      {/* PAGE HEADER */}
      <section className="border-b border-border bg-muted py-16 lg:py-20">
        <div className="container-x">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-4 text-display-xl text-navy-900">Terms &amp; Conditions</h1>
          <p className="mt-4 max-w-2xl text-lg text-navy-600">
            Please read these terms carefully before placing an order or using our services.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            <div className="space-y-12">
              {sections.map((s, i) => (
                <div key={s.title} className="scroll-mt-24" id={s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-xs font-bold tabular-nums text-accent-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h2 className="text-xl font-semibold text-navy-900">{s.title}</h2>
                  </div>
                  <div className="mt-4 pl-8">
                    {'body' in s && s.body ? (
                      s.body
                    ) : (
                      <p className="text-navy-600 leading-relaxed">{s.content}</p>
                    )}
                  </div>
                  {i < sections.length - 1 && (
                    <div className="mt-12 border-b border-border" />
                  )}
                </div>
              ))}
            </div>

            {/* CONTACT FOOTER */}
            <div className="mt-16 rounded-lg border border-border bg-muted px-8 py-8">
              <h3 className="text-base font-semibold text-navy-900">Questions about these terms?</h3>
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
