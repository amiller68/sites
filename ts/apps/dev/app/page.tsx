import { TypingHeader } from "@repo/ui";
import { SocialLinks } from "./components/social-links";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="max-w-[50ch] flex flex-col items-center">
        <TypingHeader text="> it's nice to see u" size="text-4xl" />
        <div className="mt-8">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
