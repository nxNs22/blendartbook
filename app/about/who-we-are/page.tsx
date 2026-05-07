import Link from "next/link";
import { ArrowRight, BookOpen, Globe, HeartHandshake, Sparkles } from "lucide-react";

const highlights = [
  {
    title: "Curated Selection",
    description:
      "We blend classics, contemporary voices, and hidden gems so every visit feels meaningful.",
    icon: BookOpen,
  },
  {
    title: "Global Readers",
    description:
      "Our catalog supports readers across languages, formats, and different reading habits.",
    icon: Globe,
  },
  {
    title: "Human Support",
    description:
      "Real people answer questions quickly and help readers choose the right books.",
    icon: HeartHandshake,
  },
];

export default function WhoWeArePage() {
  return (
    <main className="bg-gradient-to-b from-teal-50 via-white to-emerald-50">
      <section className="relative overflow-hidden border-b border-teal-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,137,123,0.18),transparent_45%)]" />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative">
          <p className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-800">
            <Sparkles size={14} />
            About blendartbook
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl md:text-5xl font-black text-[#0F2F33] leading-tight">
            We build a better way to discover and enjoy books online.
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-teal-900/80 leading-relaxed">
            blendartbook is a modern bookstore platform designed for readers who
            want trusted recommendations, simple checkout, and a seamless
            reading journey across print, e-books, and audiobooks.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14 md:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map(({ title, description, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm hover-lift"
            >
              <div className="mb-4 inline-flex rounded-xl bg-teal-100 p-3 text-teal-800">
                <Icon size={22} />
              </div>
              <h2 className="text-lg font-bold text-[#173A3B]">{title}</h2>
              <p className="mt-2 text-sm text-slate-600 leading-6">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 md:pb-20">
        <div className="rounded-3xl border border-teal-200 bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-800 p-7 md:p-10 text-white">
          <h2 className="text-2xl md:text-3xl font-black">Our mission</h2>
          <p className="mt-4 max-w-3xl text-teal-100 leading-7">
            Make reading easier to access, more inspiring to explore, and more
            personal for every customer. We invest in thoughtful curation,
            transparent service, and long-term trust.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/about/contacts"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-teal-900 hover:bg-teal-50 transition-colors"
            >
              Contact our team
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/about/books-sustainability"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Sustainability focus
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
