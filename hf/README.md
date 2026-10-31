# Hugging Face

This directory contains Hugging Face-specific deployment and integration assets for the NLT Coding Agent.

## Deployment boundary

The main application is a full-stack Next.js application. It depends on server-side API routes, sessions, database access, and runtime services, so it cannot be published as a complete Hugging Face Static Space without first separating a static frontend from its backend.

Keep Hugging Face-specific files in this directory rather than changing the root Vercel application configuration. Add a Space-specific build or publish workflow here only after its target runtime is defined.

## Planned contents

- Space-specific configuration and metadata
- Docker or static frontend build assets, depending on the selected Space runtime
- GitHub Actions workflow support for publishing to the Hugging Face Space

No credentials or secrets belong in this directory. Store deployment tokens in GitHub Actions secrets.
