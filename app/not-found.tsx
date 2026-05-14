import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-teal-50 rounded-3xl flex items-center justify-center text-[#5BCDE9] mx-auto mb-6">
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-[#1A2E35] mb-4">Page not found</h1>
          <p className="text-gray-500 mb-10">
            The page you are looking for doesn't exist or has been moved to a new location.
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-block bg-[#1A2E35] text-white font-black py-4 px-10 rounded-2xl hover:bg-black transition-all shadow-lg"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
