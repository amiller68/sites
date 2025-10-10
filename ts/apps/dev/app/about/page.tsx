import { TypingHeader } from "@repo/ui";
import { SocialLinks } from "../components/social-links";

export default function About() {
  return (
    <div className="flex justify-center items-center min-h-[80vh] pt-12">
      <div className="max-w-[75ch]">
        <TypingHeader text="> about" size="text-4xl" />
        <h2 className="mt-8 text-2xl font-semibold mb-6">
          Hey there, my name is Alex!
        </h2>
        <div className="text-xl leading-relaxed">
          <p className="mb-4">
            I&apos;m an all-in-one startup engineer who codes, manages teams,
            owns product, collaborates on vision — and everything in between.
            I&apos;ve spent the last few years building at the intersection of
            AI, blockchain, and scalable platform architecture.
          </p>
          <p className="mb-4">
            Currently I&apos;m a founding engineer at{" "}
            <a
              href="https://getquotient.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Quotient
            </a>
            , building agentic platforms that help businesses engage with
            audiences through AI. Before that, I founded Krondor Corp — my
            consulting practice where I help early-stage startups get from
            concept to production-ready, scalable platforms quickly.
          </p>
          <p className="mb-4">
            My experiences span holding founding engineer roles (Banyan
            Computer, decentralized storage), helping clients launch successful
            MVPs (
            <a
              href="https://satgo.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              SatGo
            </a>{" "}
            iOS app for Bitcoin ecosystem,{" "}
            <a
              href="https://libertai.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              LibertAI
            </a>{" "}
            decentralized AI infrastructure), and even winning an EigenLayer
            bounty at EthDenver 2025 with my{" "}
            <a
              href="https://jax.ac/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              JAX
            </a>{" "}
            project.
          </p>
          <p className="mb-4">
            I&apos;m passionate about infrastructure, maniacal over product, and
            methodical about code quality. I move across frontend, backend, and
            DevOps with ease — Rust to Swift to Solidity to Terraform, whatever
            gets the job done.
          </p>
          <p className="mb-4">
            Interested in working together? Just wanna say hi? Feel free to
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
