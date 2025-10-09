import { TypingHeader } from "@repo/ui";
import { ContactForm } from "./contact-form";
import { SocialLinks } from "../components/social-links";

export default function Contact() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="space-y-12 w-full max-w-md">
        <div>
          <TypingHeader text="> contact" size="text-4xl" />
        </div>

        <div>
          <ContactForm />
        </div>

        <div className="max-w-md mx-auto px-6">
          <h3 className="text-xl font-semibold mb-2 text-center">
            Connect with me
          </h3>
          <p className="text-muted-foreground mb-6 text-center">
            You can also reach out through any of these channels:
          </p>
          <SocialLinks className="flex gap-4 justify-center" />
        </div>
      </div>
    </div>
  );
}
