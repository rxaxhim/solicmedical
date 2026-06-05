import Link from 'next/link';
import { ArrowLeft, ArrowRight, Construction } from 'lucide-react';

export default function ProductsPlaceholder() {
  return (
    <section className="section-pad bg-white">
      <div className="container-x">
        <div className="mx-auto max-w-2xl py-16 text-center lg:py-24">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-navy-50 text-navy-700">
            <Construction className="h-6 w-6" strokeWidth={1.75} />
          </div>
          <p className="eyebrow mt-6">Coming next phase</p>
          <h1 className="mt-4 text-display-lg text-navy-900">
            Product catalogue in development
          </h1>
          <p className="mt-5 text-navy-600">
            Our new product catalogue with full search, category browsing, and
            detailed product pages is being built. Check back soon, or get in
            touch in the meantime.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-ghost">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <Link href="/contact" className="btn-primary">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
