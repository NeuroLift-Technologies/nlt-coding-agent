# Hugging Face deployment plan

**Status:** Planning  
**Scope:** NLT Coding Agent  
**Hosting boundary:** Hugging Face Space frontend or container runtime; Vercel remains the current full-stack application host.

## Current architecture constraint

The root application is a full-stack Next.js application. It uses App Router API endpoints, server-side session and request-cookie access, server actions, database access through Drizzle/Neon, and runtime integrations including Vercel Sandbox.

A Hugging Face **Static Space** cannot host those server-side capabilities. A static publish workflow that runs the root `next build` and uploads its output would not produce a functionally equivalent application.

## Supported paths

### Option A: Keep Vercel as the application runtime

- Keep authentication, API routes, database operations, and sandbox orchestration on Vercel.
- Use Hugging Face for model discovery, inference endpoints, datasets, Spaces, and other model-facing capabilities.
- If a Hugging Face Space UI is needed, build a separately deployable frontend that calls the existing backend through an explicitly configured API origin.

### Option B: Evaluate a Hugging Face Docker Space

- Package the complete Next.js server application in a Docker Space.
- Define and validate the runtime start command, port binding, health behavior, and persistent-storage requirements.
- Configure every required runtime secret in Space settings; never commit credentials.
- Verify compatibility of OAuth callback URLs, database connectivity, sandbox execution, and any Vercel-specific SDK dependencies before treating the Space as a production host.

## Publishing workflow prerequisites

Do not add an automated publish workflow until the target Space and deployment mode are selected.

For a Docker Space, define the Space repository identifier and a Hugging Face write token as GitHub Actions secrets. For a static frontend, first isolate the frontend build from all server-only routes and dependencies, and define its backend API origin.

## Acceptance criteria

- The chosen deployment mode is explicit and matches the Space metadata.
- No server-only functionality is silently omitted from a static build.
- Secrets are injected at runtime or by protected CI configuration, never stored in Git.
- Authentication, database access, and agent execution are tested end-to-end in the target runtime.
