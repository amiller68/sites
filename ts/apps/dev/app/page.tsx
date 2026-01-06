import { SocialLinks } from "./components/social-links";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <div className="max-w-xl flex flex-col items-center">
        <h1 className="text-3xl font-medium tracking-tight">
          hey, i&apos;m al
        </h1>
        <p className="mt-6 text-lg text-center leading-relaxed text-muted-foreground">
          building cool stuff with great people. frontend, backend,
          infrastructure, and everything in between.
        </p>
        <div className="mt-8">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
