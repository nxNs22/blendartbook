import Link from "next/link";
import { Clock3, Mail, MessageCircle, Phone } from "lucide-react";

const contactCards = [
  {
    title: "Email",
    value: "support@blendartbook.com",
    href: "mailto:support@blendartbook.com",
    note: "Typical response time: within 24 hours on business days.",
    icon: Mail,
  },
  {
    title: "Phone",
    value: "+40 (123) 456-789",
    href: "tel:+40123456789",
    note: "Available Monday to Friday, 09:00 - 18:00.",
    icon: Phone,
  },
  {
    title: "Live Assistance",
    value: "Q&A Center",
    href: "/qa",
    note: "Find instant answers and message support when needed.",
    icon: MessageCircle,
  },
];

export default function ContactsPage() {
  return (
    <main className="bg-gradient-to-b from-white via-teal-50/60 to-emerald-50 min-h-[70vh]">
      <section className="max-w-6xl mx-auto px-4 pt-14 md:pt-16 pb-10">
        <p className="inline-flex items-center rounded-full bg-teal-100 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-800">
          Contact blendartbook
        </p>
        <h1 className="mt-5 text-4xl md:text-5xl font-black text-[#102C34] leading-tight">
          Let&apos;s get you the help you need.
        </h1>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-teal-900/80 leading-relaxed">
          Whether it&apos;s an order question, payment issue, or a recommendation
          request, our support team is ready to help quickly.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-14 md:pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {contactCards.map(({ title, value, href, note, icon: Icon }) => (
            <article
              key={title}
              className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm hover-lift"
            >
              <div className="mb-4 inline-flex rounded-xl bg-teal-100 p-3 text-teal-800">
                <Icon size={22} />
              </div>
              <p className="text-sm font-semibold text-teal-700">{title}</p>
              {href.startsWith("/") ? (
                <Link
                  href={href}
                  className="mt-1 block text-lg font-bold text-[#11353A] hover:text-teal-700 transition-colors"
                >
                  {value}
                </Link>
              ) : (
                <a
                  href={href}
                  className="mt-1 block text-lg font-bold text-[#11353A] hover:text-teal-700 transition-colors"
                >
                  {value}
                </a>
              )}
              <p className="mt-3 text-sm text-slate-600 leading-6">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 md:pb-20">
        <div className="rounded-3xl border border-teal-200 bg-white p-7 md:p-10 shadow-sm">
          <h2 className="text-2xl font-black text-[#173A3B]">Support Hours</h2>
          <div className="mt-5 flex items-start gap-3 text-slate-700">
            <Clock3 size={20} className="mt-0.5 text-teal-700" />
            <p className="leading-7">
              Monday - Friday: 09:00 - 18:00<br />
              Saturday: 10:00 - 14:00<br />
              Sunday: Closed
            </p>
          </div>
          <div className="mt-7">
            <Link
              href="/about/who-we-are"
              className="inline-flex rounded-xl bg-teal-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 transition-colors"
            >
              Learn more about us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
