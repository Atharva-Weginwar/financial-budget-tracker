import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Financial Budget Tracker
        </h1>
        <p className="text-xl mb-8 text-center max-w-2xl">
          A comprehensive financial management application to help you track your budget, visualize spending, and plan for the future.
        </p>
        <div className="flex gap-4">
          <Link 
            href="/auth/signin" 
            className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="px-6 py-3 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
} 