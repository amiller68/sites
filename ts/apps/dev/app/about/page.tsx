import { SocialLinks } from "../components/social-links";

export default function About() {
  return (
    <div className="flex justify-center items-start min-h-[80vh] py-12">
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium tracking-tight">about</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Hey, I&apos;m Alex.
        </p>
        <div className="mt-6 text-base leading-relaxed text-foreground/90 space-y-4">
          <p>
            I&apos;m an all-in-one startup engineer who codes, manages teams,
            owns product, and collaborates on vision. I&apos;ve spent the last
            few years building at the intersection of AI, blockchain, and
            scalable platform architecture.
          </p>
          <p>
            Currently a founding engineer at{" "}
            <a
              href="https://getquotient.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Quotient
            </a>
            , building agentic platforms that help businesses engage with
            audiences through AI. I also run Krondor Corp, helping early-stage
            startups get from concept to production quickly.
          </p>
          <p>
            Past work includes founding engineer roles at Banyan Computer
            (decentralized storage), launching MVPs like{" "}
            <a
              href="https://satgo.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              SatGo
            </a>{" "}
            and{" "}
            <a
              href="https://libertai.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              LibertAI
            </a>
            , and winning an EigenLayer bounty at EthDenver 2025 with{" "}
            <a
              href="https://jax.ac/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              JAX
            </a>
            .
          </p>
          <p>
            I move across frontend, backend, and DevOps with ease—Rust to Swift
            to Solidity to Terraform, whatever gets the job done.
          </p>
          <p className="text-muted-foreground">
            Want to work together or just say hi? Reach out.
          </p>
        </div>
        <div className="mt-8">
          <SocialLinks className="flex gap-4 justify-center" />
        </div>
      </div>
    </div>
  );
}
