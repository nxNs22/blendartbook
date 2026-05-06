import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full border border-teal-100 rounded-2xl p-8 text-center bg-teal-50">
        <CheckCircle2 size={52} className="mx-auto text-teal-600 mb-4" />
        <h1 className="text-2xl font-black text-[#1A2E35] mb-2">Payment successful</h1>
        <p className="text-sm text-gray-700">
          Thank you. Your payment has been received and processed securely.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="px-5 py-2 rounded-lg bg-[#2CB391] text-white font-bold hover:bg-[#249278]">
            Continue shopping
          </Link>
          <Link href="/cart" className="px-5 py-2 rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-white">
            Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}

