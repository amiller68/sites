type Project = {
  name: string;
  description: string;
  href?: string;
  docs?: string;
  demo?: string;
  language: string;
};

const projects: Project[] = [
  {
    name: "jax",
    description:
      "Local-first encrypted storage with peer-to-peer sync. Content-addressed files, ChaCha20-Poly1305 encryption, and automatic device synchronization built on Iroh. Desktop app and CLI available.",
    href: "https://github.com/jax-protocol/jax-fs",
    demo: "https://jax.krondor.org",
    language: "Rust",
  },
  {
    name: "jig",
    description:
      "Git worktree manager for orchestrating AI coding agents in parallel. Spawn isolated sessions, monitor them from a live dashboard, and let a daemon nudge stuck workers — so you focus on what to build, not the mechanics of how.",
    href: "https://github.com/krondor-corp/jig",
    docs: "https://jig.krondor.org",
    language: "Rust",
  },
  {
    name: "oops",
    description:
      "Fast disk usage diagnostics for macOS and Unix. Parallel scanning, honest on-disk block sizes, and purpose-built commands like drill (auto-follow the biggest child) and sweep (find node_modules, caches, and build artifacts eating your drive).",
    href: "https://github.com/krondor-corp/oops",
    docs: "https://oops.krondor.org",
    language: "Rust",
  },
  {
    name: "generic",
    description:
      "Monorepo template for building and deploying web services to a single server. Batteries-included stack with FastAPI, Axum, and React service templates, wired together by confit config, Terraform provisioning, Ansible bootstrap, and Kamal zero-downtime deploys.",
    href: "https://github.com/krondor-corp/generic",
    docs: "https://generic.krondor.org/wiki/",
    language: "HCL / Python / Rust",
  },
  {
    name: "alexplain",
    description:
      "Personal music site for streaming releases and sharing chord charts. Built with Next.js and backed by JAX object storage.",
    demo: "https://alexplain.me",
    language: "TypeScript",
  },
  {
    name: "confit",
    description:
      "One config file to rule them all. Define values in confit.toml with interpolation, shell evaluation, and pluggable providers that map URI schemes to any secrets manager or infra tool. Inject env vars, load SSH keys, mask secrets — no more sourcing dotfiles.",
    href: "https://github.com/krondor-corp/confit",
    docs: "https://krondor-corp.github.io/confit",
    language: "Rust",
  },
];

export default function Projects() {
  return (
    <div className="flex justify-center items-start min-h-[80vh] py-12">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-medium tracking-tight">projects</h1>
        <p className="mt-4 text-muted-foreground">
          Open source work from{" "}
          <a
            href="https://github.com/krondor-corp"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            Krondor Corp
          </a>
          .
        </p>
        <div className="mt-8 space-y-6">
          {projects.map((project) => (
            <div
              key={project.name}
              className="border border-border rounded-lg p-5 transition-colors hover:border-foreground/20 hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    {project.name}
                  </a>
                ) : (
                  <span className="text-lg font-medium">{project.name}</span>
                )}
                <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">
                  {project.language}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
              <div className="mt-3 flex gap-4">
                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    github &rarr;
                  </a>
                )}
                {project.docs && (
                  <a
                    href={project.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline underline-offset-2"
                  >
                    docs &rarr;
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline underline-offset-2"
                  >
                    demo &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
