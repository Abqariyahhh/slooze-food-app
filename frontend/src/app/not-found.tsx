import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🍽️</p>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <p className="text-slate-400 text-lg mb-2">Page not found</p>
        <p className="text-slate-600 text-sm mb-8">
          This page went out for delivery and never came back.
        </p>
        <Link
          href="/dashboard"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
