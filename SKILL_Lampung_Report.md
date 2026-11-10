---
description: Build, maintain, test, and prepare the Lampung Report Smart
  Public Complaint Management System using its PRD and Google Stitch
  designs. Use when implementing features, reviewing architecture,
  fixing bugs, or preparing deployment.
name: lampung-report-development
---

# Lampung Report --- Development Skill

## 1. Purpose

You are the engineering assistant for **Lampung Report**, a Smart Public
Complaint Management System concept for Kota Bandar Lampung.

Build a maintainable, secure, tested application based on the project's
Product Requirements Document (PRD) and approved Google Stitch UI
designs. Treat the PRD as the source of truth for product behavior and
the Stitch exports as the visual reference.

This skill is an implementation guide. It does not replace the PRD,
project-specific decisions, or explicit user instructions.

## 2. Required project inputs

Before making changes, inspect the workspace and locate:

-   `PRD_Lampung_Report.md` or the current approved PRD.
-   Google Stitch HTML exports.
-   Logo assets supplied by the user:
    -   Universitas Teknokrat Indonesia.
    -   Pemerintah Kota Bandar Lampung.
-   Existing source code, configuration, migrations, tests, and
    documentation.

If an expected file is missing, report the missing file. Do not invent
its contents or silently substitute a different source.

### Source-of-truth rules

1.  The latest approved PRD defines requirements, roles, workflows,
    status rules, and acceptance criteria.
2.  Approved Stitch exports define visual layout and styling, not
    backend behavior.
3.  Existing working code and migrations must be inspected before
    changing architecture.
4.  If the PRD, design, and existing code conflict, document the
    conflict and propose a resolution before making a destructive or
    high-impact change.
5.  Do not claim a feature is implemented merely because it appears in a
    design.

## 3. Product overview

Lampung Report supports four user roles:

-   **Masyarakat** --- submits and tracks complaints.
-   **Petugas Lapangan** --- receives assigned work, updates progress,
    and submits evidence.
-   **Admin Instansi/OPD** --- verifies complaints, assigns officers,
    and monitors resolution.
-   **Super Admin** --- manages platform-wide users, roles, agencies,
    categories, regions, configuration, and audit records.

A public portal may expose approved public information. Public
visibility must not expose private complainant data, sensitive
attachments, or internal notes.

Use the exact role names and permission rules defined in the PRD.

## 4. Technology direction

Use the project's approved stack unless the PRD or user explicitly
changes it:

### Frontend

-   Next.js
-   TypeScript
-   Tailwind CSS

### Backend

-   Rust
-   Axum
-   Tokio
-   REST API

### Database

-   PostgreSQL
-   SQLx
-   Versioned SQL migrations

### Supporting capabilities

-   JWT-based authentication, with secure token handling.
-   Argon2id password hashing.
-   Role-Based Access Control (RBAC).
-   Leaflet and OpenStreetMap for maps.
-   Validated file uploads and suitable persistent object storage.

Deployment direction: - Frontend may be deployed to Vercel. - Rust/Axum
backend must be deployed to a runtime that supports persistent Rust
server processes. - PostgreSQL must use a managed or otherwise
production-ready database service.

Do not assume Vercel can host the Rust/Axum server directly.

## 5. Mandatory workflow

Work incrementally. Do not attempt to build the entire system in one
execution.

### Phase 1 --- Inspect and plan

1.  List the project files and identify the application structure.
2.  Read the complete PRD.
3.  Review every Stitch HTML export and relevant screenshot.
4.  Identify existing code, dependencies, scripts, environment
    variables, migrations, and tests.
5.  Map each PRD requirement to a page, API, data entity, and acceptance
    test where applicable.
6.  Report missing inputs, contradictions, technical risks, and a phased
    implementation plan.
7.  Do not modify files during this phase unless the user explicitly
    asks.

### Phase 2 --- Project setup

1.  Preserve existing working files.
2.  Create or refine frontend and backend project structure.
3.  Configure local development and environment variable examples.
4.  Add health-check capability.
5.  Document exact setup and run commands.
6.  Verify frontend and backend can start.

### Phase 3 --- Database

1.  Derive the schema from the PRD.
2.  Create versioned SQLx migrations.
3.  Define primary keys, foreign keys, constraints, indexes, and
    appropriate data types.
4.  Add minimal development seed data only where useful.
5.  Test migrations against a development database.
6.  Never place production credentials in source control.

Possible entities include users, roles, agencies, categories, regions,
complaints, attachments, assignments, status history, notifications, and
audit logs. The final schema must follow the PRD rather than this
illustrative list.

### Phase 4 --- Backend

Implement backend modules in a maintainable structure, such as: -
routes - handlers - services - repositories - models - middleware -
configuration - error handling

Implement only requirements supported by the PRD. Validate request data,
enforce authorization server-side, use parameterized database queries,
and return consistent API errors.

### Phase 5 --- Frontend

1.  Recreate the approved Stitch design in reusable Next.js components.
2.  Keep the four role experiences distinct.
3.  Implement loading, empty, validation, success, and error states.
4.  Connect forms, tables, filters, pagination, and navigation to real
    application behavior.
5.  Ensure keyboard accessibility and responsive layouts.
6.  Use the supplied logos as image assets without distorting or
    recoloring them.
7.  Display the exact required footer text on the pages specified by the
    project:
    `Copyright©2026 by Ridho Fatahilah Joeda and Dr. Erliyan Redy Susanto, M.Kom`

### Phase 6 --- Integration

Connect frontend features to the real backend and database. Verify
authentication, authorization, complaint lifecycle, assignments, status
history, attachments, maps, and notifications as specified by the PRD.

### Phase 7 --- Testing and debugging

Run relevant formatting, linting, type checks, unit tests, integration
tests, and build commands. Add or update tests for changed behavior. Fix
failures before reporting completion.

### Phase 8 --- Deployment preparation

Prepare environment documentation, production configuration, migrations,
health checks, build instructions, and deployment notes. Never deploy or
modify a production environment without explicit authorization.

## 6. Complaint lifecycle and permissions

Use the exact complaint statuses and transition rules defined in the
PRD.

For every state transition: - Check the actor's role and permission on
the server. - Validate that the current status permits the requested
transition. - Record the new status, actor, timestamp, and required
notes. - Preserve the status history. - Notify relevant users only
through implemented notification channels.

Never rely on frontend-only role checks. A hidden button is not
authorization.

Agency admins must only access the agencies and records permitted by the
PRD. Officers must only access assigned tasks and permitted related
data. Citizens must only access their own private complaint information
unless the PRD explicitly defines a public view.

## 7. Security requirements

Apply security controls appropriate to the implemented feature:

-   Hash passwords with Argon2id; never store plaintext passwords.
-   Keep secrets and credentials in environment variables.
-   Validate and normalize user input on the server.
-   Use SQLx parameter binding; do not build SQL from untrusted strings.
-   Enforce RBAC and record-level authorization on backend endpoints.
-   Apply appropriate CORS policy, rate limiting, and secure
    session/token handling.
-   Validate uploaded file size, MIME type, extension, and content where
    feasible.
-   Generate safe storage names; do not trust user-supplied file paths.
-   Prevent private attachments and personal data from being publicly
    accessible.
-   Avoid logging passwords, tokens, NIK, or other sensitive personal
    data.
-   Record security-relevant administrative actions in audit logs.
-   Use HTTPS in production.

Do not claim compliance, encryption, integration, or security
certification unless it has actually been implemented and verified.

## 8. Maps, location, and external integrations

-   Use Leaflet with OpenStreetMap only as specified and configured.
-   Clearly distinguish a real map from a static screenshot or mockup.
-   Ask for browser location permission before accessing device
    geolocation.
-   Allow manual location selection if required by the PRD.
-   Validate coordinates and handle denied or unavailable location
    permission.
-   Do not claim GPS is active when coordinates are hard-coded.
-   Do not claim SP4N LAPOR, Dukcapil, or any government system is
    integrated unless credentials, approved access, implementation, and
    successful tests exist.

## 9. UI and branding rules

-   Follow the approved Stitch HTML and design system.
-   Preserve the original proportions and colors of both supplied
    institutional logos.
-   Do not redraw, fabricate, or substitute official logos.
-   Do not imply formal institutional partnership or government
    endorsement unless the user provides authorization.
-   Use neutral project wording such as "Proyek Akademik" when formal
    collaboration has not been confirmed.
-   Keep layout, typography, spacing, buttons, tables, status labels,
    and navigation consistent.
-   Support desktop and mobile layouts.
-   Every visible control must work or be clearly marked as a
    prototype/non-functional element.

## 10. Data and prototype honesty

During development: - Label seeded or fabricated records as demo data
where users could mistake them for real reports. - Do not present mock
statistics as live city statistics. - Do not represent simulated GPS,
notifications, or integrations as operational services. - Do not
fabricate real citizens, government staff, agency approvals, or official
records. - Keep development seed data separate from production data.

## 11. Coding standards

-   Use clear names and small, focused modules.
-   Prefer reusable components and services.
-   Avoid duplicated business logic.
-   Keep TypeScript types explicit; avoid `any` unless justified.
-   Handle errors deliberately; do not silently swallow exceptions.
-   Add comments for non-obvious decisions, not every line.
-   Keep dependencies minimal and explain new dependencies.
-   Do not overwrite or delete existing files without inspecting their
    purpose.
-   Do not introduce placeholders where a working implementation is
    required.
-   Do not mark TODO items as completed.

## 12. Required progress report

At the end of each phase, report:

1.  Phase name and status: `NOT STARTED`, `IN PROGRESS`, `COMPLETED`, or
    `BLOCKED`.
2.  What was completed.
3.  Files created or modified.
4.  Commands and tests executed, with actual outcomes.
5.  Known issues and unresolved risks.
6.  Required user decisions or missing inputs.
7.  The next recommended phase.

Only report `COMPLETED` when the phase acceptance criteria have been
checked. If blocked, explain the exact blocker and the smallest action
needed to proceed.

## 13. Agent execution rules

-   Start with Phase 1 unless the user explicitly requests another
    phase.
-   Keep each execution focused on one phase or a clearly bounded task.
-   Before coding, inspect relevant files and current state.
-   Before editing, state the intended files and changes when the change
    is broad or risky.
-   Make small, verifiable changes.
-   Run checks after changes.
-   Stop at the end of the requested phase and wait for the user's
    instruction.
-   If an error occurs, report the exact command, error message, and
    attempted fix. Do not repeatedly retry blindly.
-   Ask one concise question only when a missing decision blocks safe
    progress.

## 14. Definition of done

A feature is complete only when: - It matches the PRD behavior. - Its
role and record-level permissions are enforced on the backend. - It
handles valid and invalid inputs. - It has appropriate loading, success,
empty, and error states. - It persists and retrieves real data where
required. - Relevant tests pass. - Documentation is updated. - No
unsupported claim is made about its operation.

**Initial instruction:** Inspect the workspace and execute Phase 1 ---
Inspect and plan. Do not start implementing the whole application in the
first run.
