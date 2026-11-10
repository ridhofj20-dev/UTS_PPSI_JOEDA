---
name: Smart Civic Operations
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#44474e'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#485f83'
  primary: '#00142f'
  on-primary: '#ffffff'
  primary-container: '#0f294a'
  on-primary-container: '#7a91b7'
  inverse-primary: '#b0c8f1'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#1f1100'
  on-tertiary: '#ffffff'
  tertiary-container: '#392400'
  on-tertiary-container: '#c18300'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b0c8f1'
  on-primary-fixed: '#001b3b'
  on-primary-fixed-variant: '#30476a'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffddb0'
  tertiary-fixed-dim: '#ffba46'
  on-tertiary-fixed: '#281800'
  on-tertiary-fixed-variant: '#614000'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  metric-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.03em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

This design system establishes an authoritative, reliable, and high-clarity interface tailored for public municipal governance and academic technological partnership. It is engineered for civil servants, municipal officers, university administrators, and citizens who require swift, transparent incident logging and rapid triage.

The aesthetic fuses **Corporate / Modern GovTech** with **Enterprise Precision**:
- **Clarity over decorative flourish:** Layouts prioritize dense information delivery, high data scanability, and robust visual hierarchies.
- **Civic Trust & Authority:** Deep navy tones evoke constitutional stability, balanced with energetic digital cobalt for responsive interactions.
- **Institutional Heritage:** Accents of municipal golden yellow from the Kota Bandar Lampung insignia and alert crimson derived from the Universitas Teknokrat Indonesia identity provide culturally grounded, high-significance feedback markers.
- **Clean Structure:** Generous negative space between actionable modules, crisp low-contrast borders, and strict metric alignments reinforce transparency and operational efficiency.

## Colors

The color architecture is built to ensure effortless scanning across complex workflows, maps, tables, and incident cards.

### Core Roles
- **Primary Navy (`#0F294A` / `#1A365D`):** Applied to primary headers, persistent enterprise sidebars, core navigation shells, and primary identity anchors.
- **Secondary Action Blue (`#2563EB` / `#1D4ED8`):** Directs task flow—primary CTAs, interactive links, active pagination states, and focused input indicators.
- **Civic Gold (`#CA8A04` / `#EAB308`):** Used for "Under Review", "Pending Verification", warnings, and civic achievement indicators.
- **Urgent Red (`#DC2626` / `#EF4444`):** Strictly reserved for high-priority complaints, escalations, system errors, and destructive operations.
- **Success Green (`#16A34A` / `#22C55E`):** Represents "Resolved", "Dispatched", and verified citizen feedback.

### Surface System
- **Canvas Base:** `#F8FAFC` (Clean Surface Slate) provides distinct separation from content containers.
- **Card / Surface Container:** `#FFFFFF` (Pure White) with an explicit hairline border (`#E2E8F0`).
- **Surface Hover / Row Alternate:** `#F1F5F9`.
- **Text Primary:** `#0F172A` (Slate 900) ensures AAA compliance against white and pale slate backgrounds.
- **Text Muted:** `#64748B` (Slate 500) for timestamps, secondary labels, and metadata.

## Typography

The typography pairing uses **Plus Jakarta Sans** for prominent headings and statistical metrics, paired with **Inter** for data tables, operational forms, and micro-copy.

- **Headlines:** Set in Plus Jakarta Sans with negative tracking to convey a contemporary, institutional authority.
- **Numerical Metrics:** Metric displays leverage bold Plus Jakarta Sans weights to ensure operational KPIs (e.g., "Active Reports", "Avg Resolution Time") remain instantly legible from control dashboards.
- **Data & Administrative Content:** Inter provides neutral clarity across compact complaint logs, system notifications, and multiline citizen testimonials. Tabular figures (`font-variant-numeric: tabular-nums`) must be enabled on all numerical data columns.

## Layout & Spacing

The system implements a rigid 12-column fluid grid tailored for data-dense dashboards and citizen portals.

### Grid Breakpoints
- **Mobile (< 768px):** Single-column stack, outer canvas margin `1rem`, card padding `1rem`. Navigation collapses into a top utility bar with persistent sheet drawer.
- **Tablet (768px - 1024px):** 8-column layout, gutter `1rem`, outer margin `1.5rem`. Side-by-side complaint listings and preview panels.
- **Desktop (1024px - 1440px+):** 12-column layout with a fixed 260px administrative sidebar. Gutter `1.5rem`, outer margin `2rem`. Supports standard 3-to-4 column KPI card rows and split screen map-and-table views.

### Vertical Rhythm
Information cards, forms, and data panels maintain vertical gaps of `1.5rem` (`space-lg`), while internal module padding enforces `1.25rem` to `1.5rem` to prevent cramped visual density.

## Elevation & Depth

This system avoids dramatic skeuomorphism or heavy drop shadows in favor of **Crisp Tonal Layering** and **Subtle Structural Shadows**.

- **Level 0 (Canvas Base):** Flat `#F8FAFC`.
- **Level 1 (Cards, Metric Tiles, Table Wrappers):** `#FFFFFF` surface bounded by a continuous 1px solid border (`#E2E8F0`). Shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hovered Cards, Dropdowns, Action Popovers):** Elevated surface with border `#CBD5E1`. Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)`.
- **Level 3 (Modal Overlays, Incident Dispatch Drawers):** Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`. Modals pair with a 40% opacity Navy backdrop blur (`rgba(15, 41, 74, 0.45)` with `backdrop-filter: blur(4px)`).

## Shapes

The interface embraces a balanced modern aesthetic with moderate roundedness (`0.5rem` / `8px` baseline).

- **Standard Containers & Inputs:** `0.5rem` (`rounded-md` equivalent) on input fields, table panels, action buttons, and complaint cards to maintain a grounded, professional feel.
- **Status Badges & Chips:** Full pill geometry (`9999px`) to immediately distinguish classification metadata from actionable square buttons.
- **Large Modals & Preview Sheets:** `0.75rem` (`12px`) to provide subtle softness at the viewport perimeter.

## Components

### Buttons
- **Primary:** Background `#0F294A`, text `#FFFFFF`, hover `#1A365D`, active scale 0.98. Height 40px (desktop), 44px (mobile touch).
- **Secondary / Action:** Background `#2563EB`, text `#FFFFFF`, hover `#1D4ED8`.
- **Outline / Neutral:** Border 1px solid `#CBD5E1`, background `#FFFFFF`, text `#0F294A`, hover `#F8FAFC`.
- **Destructive:** Border 1px solid `#FCA5A5`, background `#FEF2F2`, text `#DC2626`, hover `#FEE2E2`.

### Status Badges & Pills
Constructed as 24px height pills with uppercase micro-labels (`label-sm`):
- **Pending / Moderation:** Background `#FEF9C3`, border `#FDE047`, text `#854D0E` (Civic Gold tone).
- **In Investigation / Active:** Background `#EFF6FF`, border `#BFDBFE`, text `#1D4ED8` (Royal Blue tone).
- **Resolved:** Background `#F0FDF4`, border `#BBF7D0`, text `#15803D` (Emerald tone).
- **Critical / Urgent:** Background `#FEF2F2`, border `#FECACA`, text `#B91C1C` (Teknokrat Red tone).

### Metric / KPI Stat Cards
- White surface, 1px border `#E2E8F0`, padding `1.25rem`.
- Small contextual label (`label-md`, `#64748B`) at the top, bold metric value (`metric-display`, `#0F172A`) centered, and trend indicator pill (`+12.4% vs last week`) aligned bottom-right.
- Optional 3px solid primary accent bar along the top edge for categorical distinction (e.g., Infrastructure, Sanitation, Public Safety).

### Data Tables
- **Header:** Background `#F8FAFC`, uppercase `label-sm` tracking 0.05em, text `#475569`, bottom border 1px solid `#E2E8F0`. Height 44px.
- **Row:** Height 56px, alternating border bottom `#F1F5F9`. Hover background `#F8FAFC`.
- **Columns:** Standardized alignment (Left for citizen IDs and incident titles, Center for status pills and agency badges, Right for timestamp and action menus).

### Form Fields & Inputs
- **Base:** Background `#FFFFFF`, 1px solid `#CBD5E1`, text `#0F172A`, height 42px, padding `0 0.875rem`.
- **Focus State:** Border color `#2563EB`, outer ring `2px solid rgba(37, 99, 235, 0.2)`.
- **Error State:** Border color `#DC2626`, accompanying helper icon and red message string (`body-sm`).

### Checkboxes & Radio Controls
- Checkbox uses `0.25rem` corners; radio is circular.
- Inactive state: 1.5px solid `#94A3B8`. Active state: `#2563EB` fill with crisp white checkmark/dot.