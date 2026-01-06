import { ContactForm } from "./contact-form";
import { SocialLinks } from "../components/social-links";

export default function Contact() {
  return (
    <div className="flex justify-center items-start min-h-[80vh] py-12">
      <div className="space-y-10 w-full max-w-md">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">contact</h1>
          <p className="mt-2 text-muted-foreground">
            Send me a message or reach out through socials.
          </p>
        </div>

        <ContactForm />

        <div className="pt-4 border-t border-border">
          <SocialLinks className="flex gap-4 justify-center" />
        </div>
      </div>
    </div>
  );
}
