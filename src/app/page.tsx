import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold">Welcome to Santa Gen</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Generate your perfect Secret Santa assignments
        </p>
        <Link
          href="/generator"
          className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
