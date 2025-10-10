import Link from "next/link";
import { TypingHeader } from "@repo/ui";

export default function NotFound() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="max-w-[50ch] flex flex-col items-center text-center">
        <TypingHeader text="> 404" size="text-6xl" />
        <div className="mt-8 text-xl leading-relaxed">
          <p className="mb-8 text-muted-foreground">
            looks like you&apos;ve wandered off the map...
          </p>
          <Link href="/" className="btn-primary inline-block">
            take me home
          </Link>
        </div>
      </div>
    </div>
  );
}
