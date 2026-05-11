---
name: feature-flag-rollout-implementer
description: "Use when adding, designing, or explaining feature flags in any repository, especially Java or Node projects. Ask discovery questions first, then implement the smallest safe feature-flag rollout across routes, controllers, APIs, services, UI flows, config files, env vars, tests, and release behavior."
---

# Feature Flag Rollout Implementer

Use this skill when the user wants feature flags added to an unfamiliar codebase and has not yet provided enough implementation detail. This skill is intentionally generic and should work across Java and Node repositories.

## Core Behavior

1. Ask a short discovery set of questions before editing when the flag design is not already explicit.
2. Use the answers plus a small amount of repo inspection to identify the controlling code path.
3. Implement the smallest safe change that keeps existing behavior stable when the flag is off unless the user explicitly asks for a default-on rollout.
4. Add or update tests for both flag states where practical.
5. Prefer config-driven flags first. Only implement environment variables when the user explicitly asks for this.

## Required Discovery Questions

If the user has not already answered these, ask them with a concise tool-driven questionnaire when available.

1. What runtime or stack is this: Java, Node, or mixed?
2. What behavior should the flag control: route, page, API endpoint, service logic, database migration, background job, or UI element?
3. What should happen when the flag is off?
4. What should happen when the flag is on?
5. Where should the flag live: config file, environment variable, application properties, YAML, or existing feature flag service?
6. Is this a temporary release flag, a longer-lived operational flag, or an experiment flag?
7. What validation is expected: unit tests, integration tests, end-to-end tests, or a smoke check only?

If the repo is unclear after those answers, ask at most two follow-up questions focused on the owning module or entry point.

## Runtime Detection

After asking questions, inspect the repo just enough to classify the project.

### Node indicators

- `package.json`
- `express`, `koa`, `fastify`, `nestjs`, `next`, `react`, or `vue` dependencies
- config under `config/`, `.env*`, `src/config/`, or framework settings

### Java indicators

- `pom.xml` or `build.gradle`
- Spring Boot config in `application.properties` or `application.yml`
- controllers, services, configuration classes, and tests under `src/main/java` and `src/test/java`

## Implementation Rules

1. Prefer a single authoritative flag name.
2. Place flag reads near the controlling decision point, not in unrelated leaf code.
3. Preserve current behavior as the flag-off path unless the user explicitly defines a different default.
4. Avoid scattering raw string literals for the same flag name across the codebase.
5. If multiple layers need the same flag, centralize access behind existing config patterns when the repo already has them.
6. For new release flags, design them to be removable after rollout.
7. Do not gate destructive database migrations behind runtime feature flags unless the user explicitly asks for that pattern and understands the trade-off.
8. Importantly meantain existing test coverage for the touched code paths and add new tests for the flag-on behavior when practical.
9. Use existing naming conventions and config patterns in the repo. If the user explicitly asks for a new pattern, implement it in a way that minimizes disruption to existing code.

## Node Guidance

Use these patterns when the repo is Node-based.

### Configuration

- Check existing config loading first: `config/*.json`, `.env`, `process.env`, or app bootstrap code.
- If the repo already has a config module, extend it instead of reading environment variables directly in business logic.
- If no config pattern exists, introduce the smallest consistent option the repo can support.
- When running any code make sure the correct version of Node is used, outline in package.json or .nvmrc if present.

### Typical control points

- Express or Fastify routes
- request handlers and controllers
- frontend route guards
- form validation and submission logic
- API client behavior

### Validation

- Prefer targeted unit tests for the touched controller, route, or helper.
- If the repo has `npm`, `pnpm`, or `yarn`, use the existing test script first.

## Java Guidance

Use these patterns when the repo is Java-based.

### Configuration

- Prefer `application.properties`, `application.yml`, or existing typed configuration classes.
- In Spring-based code, read flags through configuration properties or injected values that match existing conventions.
- If profiles already exist, do not replace them with flags unless the user explicitly wants that trade-off.

### Typical control points

- Spring MVC or WebFlux controllers
- service layer branches
- bean configuration
- scheduled jobs
- versioned API endpoints

### Validation

- Prefer targeted JUnit or Spring tests for the touched controller, service, or config class.
- Use `mvn test` or `gradle test` only when narrower validation is not practical.

## Database Guidance

When a feature touches persistence:

1. Prefer backward-compatible schema changes first.
2. Use nullable columns or additive tables for initial rollout when possible.
3. Keep application behavior behind the feature flag, even if the schema ships ahead of time.
4. If the user explicitly asks to flag migrations, explain the operational risk before implementing.
5. Avoid adding migration scripts into subfolders inside db/migration unless the repo already has a pattern for this.

## Recommended Question Flow Tooling

When the environment supports a question tool, prefer a compact questionnaire with fixed choices plus freeform input. A good default set is:

- runtime: Java, Node, Mixed, Unsure
- surface: UI, Route, API, Service, Database, Full flow
- default state: Off, On
- flag source: Existing config, Env var, App properties or YAML, Remote flag service, Unsure
- validation: Unit, Integration, E2E, Smoke only

## First-Edit Workflow

1. Restate the specific behavior being toggled.
2. Identify the controlling file or symbol.
3. State one falsifiable local hypothesis about how the flag should be wired.
4. Make the smallest plausible edit.
5. Run the narrowest validation immediately.

## Response Style For This Skill

When using this skill:

1. Start by asking the missing design questions.
2. Once answers are available, state the chosen flag name and default behavior.
3. Explain which layer owns the decision.
4. Implement incrementally.
5. Validate after the first substantive edit.
6. End with rollout or cleanup notes only if they are relevant.

## Default Output Expectations

- Prefer implementation over abstract advice when the repo is available.
- If the repo is missing or the target surface is ambiguous, ask questions before proposing file changes.
- If both Java and Node are present, identify which side owns the feature flag decision and whether the flag must be mirrored across layers. e.g. if the flag controls an API endpoint, it may need to be read in both the Java backend and the Node frontend.
- If the user asks for best practice, bias toward additive schema changes, explicit config, test coverage for both states, and eventual flag removal.