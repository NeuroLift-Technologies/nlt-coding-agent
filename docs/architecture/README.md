# NeuroLift Coding Agent — Architecture Diagrams

This directory documents the coding agent's execution environment, its connections, the remaining integration work, and the repository boundaries.

## Current system

- **Rivet AgentOS is live** on the Rivet Cloud cluster `neurolift-technologies`.
- **Docker is used to build the runtime image.** Docker is part of the image build/deployment pipeline; it is not assumed to run inside the coding workspace.
- **Hugging Face Space** `divergent-tech/nlt-coding-agent` hosts the static React workspace interface.
- **The repository-root Next.js/Vercel application and the `hf/` static Space application are separate applications** with independent build and deployment paths.
- The interface/runtime integration is still pending verification. A live AgentOS deployment does not, by itself, prove that the UI can authenticate, select a workspace, or execute processes.

## Diagrams

| Diagram | Purpose |
|---|---|
| [System architecture](system-architecture.mmd) | Shows the frontend, image build/deployment path, AgentOS, and isolated execution environment |
| [Connection and execution flow](connection-flow.mmd) | Shows the intended authenticated session and command lifecycle |
| [Implementation roadmap](implementation-roadmap.mmd) | Sequences discovery, integration, and runtime verification |
| [Repository structure](repository-structure.mmd) | Separates the root app, HF app, documentation, CI, and hosted runtime |

GitHub renders the linked `.mmd` Mermaid source files as diagrams. The source remains editable and can also be reused by Mermaid-compatible tooling.

## Status semantics

- **Confirmed** means established by the current project context or repository documentation.
- **Pending verification** means the capability is intended or represented by the interface, but has not yet been demonstrated against the provisioned AgentOS runtime.
- **Proposed** means a documentation or implementation organization recommendation, not a claim that the files or services already exist.

## Important boundaries

1. The HTML/JavaScript interface is a client. It does not provide operating-system isolation.
2. Runtime security, filesystem boundaries, process permissions, network restrictions, and resource limits must be enforced by the execution provider.
3. Browser-facing credentials must be scoped, short-lived where supported, held only as long as needed, and never be account-level administrative credentials.
4. Docker builds the runtime image. Do not add Docker-in-Docker or Docker socket access to the workspace unless a separate, explicit requirement justifies it.
5. Runtime operations must be verified against the live Rivet deployment before being described as operational.

## Immediate milestone

Complete and verify the authenticated workspace integration: connect to AgentOS, select or initialize a workspace, list/read/write files, execute shell commands, capture output and exit codes, and verify disconnect/reconnect and persistence behavior.
