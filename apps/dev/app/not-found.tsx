import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-medium">404</h1>
        <p className="mt-4 text-muted-foreground">page not found</p>
        <Link
          href="/"
          className="mt-6 text-sm underline underline-offset-2 hover:text-foreground transition-colors"
        >
          go home
        </Link>
      </div>
    </div>
  );
}
