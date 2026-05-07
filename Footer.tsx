import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-10 mt-auto text-white bg-teal-500 border-t">
      <div className="container px-4 mx-auto text-center">
        <h2 className="mb-6 text-2xl font-bold">All the books in the world</h2>
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link href="/order-status" className="transition hover:text-blue-600 hover:underline">
            Order Status
          </Link>
          <Link href="/faq" className="transition hover:text-blue-600 hover:underline">
            FAQ
          </Link>
          <Link href="/shipping" className="transition hover:text-blue-600 hover:underline">
            Shipping & Returns
          </Link>
          <Link href="/contact" className="transition hover:text-blue-600 hover:underline">
            Contact Us
          </Link>
        </nav>
        <div className="mt-10 text-xs text-teal-100">
          &copy; {new Date().getFullYear()} Web Library Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}