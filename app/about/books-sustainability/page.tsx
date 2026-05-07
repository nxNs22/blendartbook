import Link from "next/link";
import { Leaf, Package, Recycle, Truck } from "lucide-react";

const initiatives = [
  {
    title: "Responsible Packaging",
    description:
      "We prioritize recyclable packaging materials and reduce unnecessary wrapping.",
    icon: Package,
  },
  {
    title: "Lower-Impact Delivery",
    description:
      "Order consolidation and smarter routing help reduce transport emissions.",
    icon: Truck,
  },
  {
    title: "Circular Practices",
    description:
      "We support reuse and recycling initiatives across our logistics and office workflows.",
    icon: Recycle,
  },
];

export default function BooksSustainabilityPage() {
  return (
    <main className="bg-gradient-to-b from-emerald-50 via-white to-teal-50 min-h-[70vh]">
      <section className="relative overflow-hidden border-b border-emerald-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_45%)]" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-800">
            <Leaf size={14} />
            Sustainability at blendartbook
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl md:text-5xl font-black text-[#103536] leading-tight">
            We believe great reading experiences and responsible choices can
            grow together.
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-emerald-900/80 leading-relaxed">
            Sustainability is part of how we source, package, and deliver books.
            We are continually improving our processes to reduce waste and
            support more responsible publishing ecosystems.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 md:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {initiatives.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm hover-lift"
            >
              <div className="mb-4 inline-flex rounded-xl bg-emerald-100 p-3 text-emerald-800">
                <Icon size={22} />
              </div>
              <h2 className="text-lg font-bold text-[#173A3B]">{title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-6">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 md:pb-20">
        <div className="rounded-3xl border border-emerald-200 bg-white p-7 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-black text-[#143C3B]">
            Our commitment
          </h2>
          <p className="mt-4 text-slate-700 leading-7 max-w-3xl">
            We track our progress over time and partner with suppliers who share
            responsible sourcing standards. This is an ongoing journey, and we
            stay transparent about where we are and where we want to improve.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/about/contacts"
              className="inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              Contact sustainability team
            </Link>
            <Link
              href="/about/who-we-are"
              className="inline-flex rounded-xl border border-emerald-200 px-5 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors"
            >
              Back to who we are
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
