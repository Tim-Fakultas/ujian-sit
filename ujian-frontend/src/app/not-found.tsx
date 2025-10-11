import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-600 mb-4">404</h1>
        <h2 className="text-4xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-300 mb-8 max-w-md">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Return Home
        </Link>
        <Link
          href="/dashboard"
          className="bg-transparent border border-gray-500 hover:border-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Go to Dashboard
        </Link>
      </div>

      <div className="text-center text-gray-500 text-sm mt-8">
        <p>If you believe this is an error, please contact support.</p>
      </div>
    </div>
  );
}
