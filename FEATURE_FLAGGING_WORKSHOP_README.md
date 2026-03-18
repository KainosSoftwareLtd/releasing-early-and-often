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

### Story 2: Versioned API for Child Data

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

### Story 3: Feature-Toggled Database Migration

- **Example Answer Branch:** `feature/Exercise-2-feature-toggled-db-script`
- **User story:**
  As a platform team, we want child schema changes to run only under controlled conditions so that deployment risk is reduced.

#### Acceptance Criteria

1. Schema changes can be applied safely for child feature rollout.
2. Existing schema remains valid for non-child flow.
3. Migration behavior is deterministic and testable.
4. Tests cover enabled and disabled migration scenarios.

#### Learning Outcomes

- Safe rollout of schema changes.
- Migration strategy with feature-flag awareness.
- Operational risk reduction during deployment.

#### Tech Notes

- TODO -> PENDING

---

### Story 4: Test End-to-End V2 Child Journey Integration

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
