import { TypingHeader } from "@repo/ui";

export default function Projects() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="max-w-[50ch]">
        <TypingHeader text="> projects" size="text-4xl" />
        <div className="mt-8 text-xl leading-relaxed">
          <p className="mb-4 text-muted-foreground">coming soon...</p>
        </div>
      </div>
    </div>
  );
}
