"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#1A2E35] mb-4">Something went wrong</h1>
          <p className="text-gray-500 mb-10">
            An unexpected error occurred while processing your request. Please try refreshing the page.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-[#2CB391] text-white font-black py-4 px-8 rounded-2xl hover:bg-[#249278] transition-all shadow-lg shadow-teal-900/10"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-gray-100 text-[#1A2E35] font-black py-4 px-8 rounded-2xl hover:bg-gray-200 transition-all"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
