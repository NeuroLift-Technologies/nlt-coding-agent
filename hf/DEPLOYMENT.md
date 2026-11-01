# Hugging Face Static Space deployment

**Status:** Implemented in GitHub Actions  
**Scope:** NLT Coding Agent React frontend  
**Space:** `divergent-tech/nlt-coding-agent`  
**Source:** `hf/` in this repository  
**Build workflow:** `.github/workflows/publish.yml`

## Deployment architecture

The Hugging Face Space is a React static frontend. GitHub Actions performs the Node.js build and uploads the prebuilt output to the Space. This keeps compilation on GitHub-hosted runners rather than invoking the Hugging Face Static Space build service.

The Space metadata uses `sdk: static` and `app_file: index.html`. It intentionally does not define `app_build_command`: the workflow publishes the compiled `index.html` and its static assets at the Space repository root.

## Workflow behavior

- Pull requests affecting `hf/**` run the React build and upload a build artifact, but do not publish to Hugging Face.
- Pushes to `main` affecting `hf/**` build and publish the compiled static application.
- Manual dispatch on `main` builds and publishes the Space.
- The build uses Node.js 20 and the React app in `hf/`.
- Only the compiled output and Space README are uploaded to Hugging Face; source remains maintained in GitHub.

## Authentication and publishing

Publishing uses Hugging Face Trusted Publishers with GitHub Actions OIDC. No `HF_TOKEN` GitHub secret or long-lived Hugging Face access token is required.

The publisher must match these GitHub claims:

- Repository: `NeuroLift-Technologies/nlt-coding-agent`
- Branch: `main`
- Workflow: `publish.yml`

The publish job requests `id-token: write`, sets `HF_OIDC_RESOURCE=spaces/divergent-tech/nlt-coding-agent`, and uses the Hugging Face CLI to exchange the GitHub OIDC identity for a short-lived, Space-scoped token.

Pull-request runs only build and upload a GitHub Actions artifact. They do not receive OIDC publishing permission and never publish to the Space.

## Local build

From the repository root:

```bash
cd hf
npm install --legacy-peer-deps
npm run build
```

The production output is written to `hf/build/`.

## Repository configuration

Set the GitHub Actions repository variable `REACT_APP_HARNESS_ENDPOINT` to the governed harness endpoint URL. If unset, the frontend reports an unconfigured state and disables prompt submission.

The root repository application is a full-stack Next.js application using server-side API routes, sessions/cookies, Drizzle/Neon, and Vercel Sandbox. Those capabilities are not included in this static Space build.

The React Space is the user-facing frontend surface. Agent orchestration, model inference, repository operations, and code execution must be provided by separately configured backend services and exposed through explicit APIs.

## Acceptance criteria

- The GitHub Actions build completes successfully.
- The published Space contains `index.html` and its generated static assets.
- Pull request builds never publish.
- Publishing is gated by the GitHub Actions OIDC identity matching the Trusted Publisher claims.
- No secrets are committed to either repository.
