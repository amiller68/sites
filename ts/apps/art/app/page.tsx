import { TypingHeader } from "@repo/ui";
import { SocialLinks } from "./components/social-links";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="max-w-[50ch] flex flex-col items-center">
        <TypingHeader text="> welcome to my art space" size="text-4xl" />
        <p className="mt-6 text-center text-muted-foreground">
          creative notes, visual works, and music
        </p>
        <div className="mt-8">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
