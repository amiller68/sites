import { TypingHeader } from "@repo/ui";
import { SocialLinks } from "../components/social-links";

export default function About() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="max-w-[50ch]">
        <TypingHeader text="> about" size="text-4xl" />
        <div className="mt-8 text-xl leading-relaxed">
          <p className="mb-4">hey there, welcome! my name is alex.</p>
          <p className="mb-4">
            i&apos;m a software engineer with a background in product, system,
            and protocol design, having worked with teams of all sizes, all
            across the world.
          </p>
          <p className="mb-4">
            a born and raised new yorker, i enjoy building things, making music,
            and sharing my ideas.
          </p>
          <p className="mb-4">
            interested in working together? just wanna say hi? feel free to
            reach out!
          </p>
        </div>
        <div className="mt-8">
          <SocialLinks className="flex gap-4 justify-center" />
        </div>
      </div>
    </div>
  );
}
