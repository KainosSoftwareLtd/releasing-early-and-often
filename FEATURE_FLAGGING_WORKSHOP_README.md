# Feature Flagging Workshop

## Overview

This workshop teaches progressive delivery using feature flags across frontend, backend API versioning, and database migrations.

Each story below is treated as a staged learning path.
Therefore, for context it might be best to approach one story at a time i.e. starting at 1, 2, etc.
That being said, because work is safely feature flagged. Stories may be done in any order.

## Epic

**Epic title:** Progressive Feature Flagging for Child Passport Journey

**Epic goal:** Deliver a new child application journey safely using feature flags, while protecting existing behavior for current users.

### Epic Success Criteria

1. Existing journey still works when the feature flag is off.
2. Child journey works end-to-end when the feature flag is on.
3. API versioning supports backward compatibility.
4. Database changes are introduced safely and can be controlled by rollout strategy.

## Stories

### Story 1: Frontend Feature Flag Gating

- **Example Answer Branch:** `feature/Exercise-1-enable-child-app-journey-when-feature-flag-is-true`
- **User story:**
  As a product team, we want the child journey to be available only when a feature flag is enabled so that we can release safely and control exposure.

#### Acceptance Criteria

1. Child journey is blocked when the flag is off.
2. Child journey route and pages are available when the flag is on.
3. Existing non-child flow remains unchanged.
4. Unit tests cover both flag states.

#### Learning Outcomes

- Route and page gating with a feature flag.
- Conditional validation and session flow.
- Testing both enabled and disabled paths.

#### Tech Notes

- Add a featureFlag value in config/config.json
- Add new routing/content for pages under routes/index.js
    - /parents-details (get - page to capture parent details)
    - /child-unavailable (what happens when the featureFlag is disabled i.e. kick out page)
- As part of the routing changes we also want to add child eligibility checks -> to ensure the customer is being routed correctly when the featureFlag is enabled

---

### Story 2: Backward-Compatible Database Schema for Parent Details

- **Example Answer Branch:** `feature/Exercise-2-add-backward-compatible-parent-columns-to-db`
- **User story:**
  As a backend team, we want to add parent detail columns to the existing `passport_applications` table in a backward-compatible way so that the schema supports the child journey without breaking existing records or the current application flow.

#### Acceptance Criteria

1. Four new columns are added to `passport_applications`: `parent1_full_name`, `parent1_contact`, `parent2_full_name`, `parent2_contact`.
2. All new columns are nullable so that existing rows remain valid without any data migration.
3. The migration is applied via a versioned Flyway script (`V2__`) so it runs automatically on startup and is tracked.
4. Existing passport application functionality continues to work unchanged after the migration runs.
5. The schema change can be applied to a live database without requiring downtime or a coordinated application release.

#### Learning Outcomes

- How to introduce schema changes without breaking existing consumers (backward-compatible migrations).
- Why nullable columns are the safest way to add new fields to a live table.
- How Flyway versioned migrations provide deterministic, repeatable schema rollout.
- The relationship between database changes and API versioning — schema can be deployed ahead of the code that uses it.

#### Tech Notes

- Add a new Flyway migration file at `passport-backend/src/main/resources/db/migration/V2__add_parent_details_columns.sql`.
- Use `ALTER TABLE passport_applications ADD COLUMN` for each new field — do **not** add `NOT NULL` constraints, as this would break existing rows.
- The four columns to add are:
  - `parent1_full_name VARCHAR(255)`
  - `parent1_contact VARCHAR(255)`
  - `parent2_full_name VARCHAR(255)` (optional — parent 2 may not exist)
  - `parent2_contact VARCHAR(255)` (optional)
- Because the columns are nullable, this migration is safe to run before the V2 API or frontend feature flag is enabled.

---


<br/>

**Warning:** The pattern in this story (gating a database migration behind a feature flag) is technically possible but is **not standard practice** in most real-world systems. Database migrations are typically treated as a separate, always-on concern from application feature flags. Mixing the two can introduce operational complexity, make rollback harder to reason about, and lead to schema drift across environments. This story is included to explore the concept and understand its trade-offs, not as a recommended pattern to adopt by default.


### Story 3: Feature-Toggled Database Migration

- **Example Answer Branch:** `feature/Exercise-2a-feature-toggled-db-script`
- **User story:**
  As a platform team, we want the V2 parent detail schema migration to only run when the `feature.child-renewals.enabled` flag is on so that we can control exactly when database changes are applied, independent of deployment.

#### Acceptance Criteria

1. When `feature.child-renewals.enabled=false`, only the V1 migration runs and no parent columns exist in the database.
2. When `feature.child-renewals.enabled=true`, the V2 migration runs and all four parent columns (`parent1_full_name`, `parent1_contact`, `parent2_full_name`, `parent2_contact`) are added.
3. Existing schema and application behaviour remain valid when the flag is off.
4. The feature flag value is configured in `application.properties`.
5. Tests explicitly verify both the flag-off (V1 only) and flag-on (V1 + V2) migration outcomes.

#### Learning Outcomes

- How migration execution can be made conditional on a feature flag, and what that means for delivery workflows.
- The risks and trade-offs of coupling schema migration behaviour to runtime configuration.
- How to design tests that prove behaviour in both enabled and disabled flag states.
- Why this pattern is generally treated as an exception and should be approached cautiously.

#### Tech Notes

- Think about having a Flyway config class that will read the feature flag value and then run the relevant migration.
- Think about how to physically separate the V2 migration script from the V1 scripts so that it can be included or excluded independently.
- The feature flag value should be configurable via `application.properties`.
- Consider how you'd write tests that verify the schema state under both flag conditions — and how to keep those test environments isolated from each other.

---

### Story 4: Versioned API for Child Data

- **Example Answer Branch:** `feature/Exercise-3-add-version2-api-to-support-child-journeyy`
- **User story:**
  As a backend team, we want to add a V2 API contract for child journey data so that we can evolve the API without breaking V1 consumers.

#### Acceptance Criteria

1. V1 contract continues to work unchanged.
2. V2 supports additional child-related fields.
3. API version selection is explicit and documented.
4. Tests verify both V1 and V2 behavior.

#### Learning Outcomes

- Backward-compatible API design.
- Safe contract evolution using version headers.
- Testing strategy for multiple API versions.

#### Tech Notes
- Add a feature flag value for child application inside application.properties.
- Add a new endpoint with the same name. HINT, look at version endpoints for SpringBoot4.
- We want the new endpoint to support the following fields:
    - parent1FullName
    - parent1Contact
    - parent2FullName (optional value)
    - parent2Contact (optional value)

---

### Story 5: Test End-to-End V2 Child Journey Integration

- **Example Answer Branch:** `TODO PENDING - Own Demo Branch`
- **User story:**
  As a release team, we want frontend, API V2, and data changes integrated behind feature flags so that we can run a staged release with confidence.

#### Acceptance Criteria

1. Child journey works end-to-end when enabled.
2. Existing journey still works when disabled.
3. Rollback approach is defined and validated.
4. Release checklist includes observability and post-release checks.

#### Learning Outcomes

- End-to-end progressive delivery.
- Coordinated rollout across services.
- Release readiness and rollback planning.


## Suggested Workshop Plan

### Session Sequence

1. Story 1: Enable child flow behind a flag in frontend.
2. Story 2: Introduce V2 API behavior for new payloads.
3. Story 3: Add migration strategy for child-specific schema fields.
4. Story 4: Validate integrated behavior and rollout process.

### Timebox (Example: 3 Hours)

1. Introduction and goals: 15 min
2. Story 1 hands-on: 40 min
3. Story 2 hands-on: 35 min
4. Story 3 hands-on: 35 min
5. Story 4 testing: 35 min
6. Debrief and discussion: 20 min

## Facilitator Notes

### Discussion Prompts

1. What should be controlled by a feature flag vs a deployment flag?
2. How do you avoid breaking old clients when introducing new fields?
3. What is the safest migration sequence for live systems?
4. What metrics and logs indicate safe rollout?

### Common Pitfalls to Watch

1. Inconsistent feature flag naming between frontend and backend.
2. Tight coupling between schema rollout and API release.
3. Missing tests for flag-off behavior.
4. No rollback plan for partial rollout failures.
