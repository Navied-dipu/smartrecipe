import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-md">
        <p className="font-display text-7xl sm:text-8xl font-bold gradient-text mb-4">
          404
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-3">
          This recipe&apos;s off the menu
        </h1>
        <p className="text-neutral-400 mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back to something delicious.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="btn-primary px-6 py-3 w-full sm:w-auto text-center">
            Go Home
          </Link>
          <Link href="/recipes" className="btn-outline px-6 py-3 w-full sm:w-auto text-center">
            Explore Recipes
          </Link>
        </div>
      </div>
    </div>
  );
}
