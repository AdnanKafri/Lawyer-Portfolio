import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.32em] text-accent">
        404
      </p>
      <h1 className="mb-4 text-4xl font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mb-8 max-w-xl text-muted-foreground">
        The page you requested is unavailable or may have moved.
      </p>
      <Link
        href="/en"
        className="rounded-full border border-border px-5 py-3 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        Return to the website
      </Link>
    </div>
  );
}
