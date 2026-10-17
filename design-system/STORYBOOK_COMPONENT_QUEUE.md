# Storybook Component Queue

## Context

- Design-system package: /Users/fengyunqi/Projects/yesterday-weather-widget/design-system
- Product repo:
- Framework:
- Storybook/catalog:
- Source trace: /Users/fengyunqi/Projects/yesterday-weather-widget/design-system/STORYBOOK_SOURCE_TRACE.md
- Component build plan: /Users/fengyunqi/Projects/yesterday-weather-widget/design-system/STORYBOOK_COMPONENT_PLAN.md
- Figma export addon:
- Package manager:
- Token import strategy:
- Target layout: components in `src/components/<ComponentName>/`, pages in `src/pages/<PageName>/`, foundation docs in `stories/` or `src/stories/`
- Typographic components: implement text lockups as editable shared components in `src/components/<ComponentName>/` unless the extraction explicitly requires raster artwork
- Current batch: B01

## Status Values

- `queued`: ready for a future batch
- `in-progress`: selected for the current batch
- `done`: implemented, documented, and verified
- `reused`: existing product component accepted as the implementation
- `blocked`: cannot continue without a decision or missing source
- `deferred`: intentionally postponed
- `needs-extraction`: missing design-system evidence or component spec
- `needs-source`: extractor source evidence exists but the Figma node, image, route, or frontend folder cannot be resolved
- `needs-token`: missing token at the required layer
- `needs-api-decision`: shared component API needs a product decision
- `needs-existing-component-review`: similar product component needs review first
- `needs-addon-compatibility`: Storybook, React, or addon setup requirement is missing
- `out-of-scope`: not part of this Storybook rollout

## Source Trace

| Source ID / location | Type | Resolved file / Figma node / route | Story source URL | Components | Status | Notes |
|---|---|---|---|---|---|---|
| ✓ delta-atmosphere.md | - | design-system/components/delta-atmosphere.md | - | DeltaAtmosphere | resolved | synced from component plan |
| ✓ primary-button.md | - | design-system/components/primary-button.md | - | Primary Button | resolved | synced from component plan |
| high | - | - | - | Floating Navigation | resolved | synced from component plan |
| medium | - | - | - | Outfit Chip | resolved | synced from component plan |
| medium | - | - | - | Weather Forecast Card | resolved | synced from component plan |
| low | - | - | - | Empty State | resolved | synced from component plan |
| low | - | - | - | Loading Indicator | resolved | synced from component plan |
| high | - | - | - | Mascot Illustration | resolved | synced from component plan |
| ✓ metric-block.md | - | design-system/components/metric-block.md | - | MetricBlock | resolved | synced from component plan |
| ✓ commute-delta-card.md | - | design-system/components/commute-delta-card.md | - | CommuteDeltaCard | resolved | synced from component plan |

## Current Component Checkpoint

| Field | Value |
|---|---|
| Active component |  |
| Queue order / batch |  |
| Dependency status |  |
| Source inspected |  |
| Existing component review |  |
| Token decision |  |
| Product files |  |
| Story files |  |
| Target layout |  |
| Verification |  |
| Blocker / next action |  |

## Dependency Plan

| Order | Component | Category | Depends on | Used by | Core reason | Status | Notes |
|---|---|---|---|---|---|---|---|
| 1 | DeltaAtmosphere | foundation | - | CommuteDeltaCard | core dependency tier; used by 1 component | queued | - |
| 2 | Primary Button | primitive | - | - | core dependency tier | queued | - |
| 3 | Floating Navigation | navigation | - | - | no dependencies detected | queued | - |
| 4 | Outfit Chip | data-display | - | - | no dependencies detected | queued | - |
| 5 | Weather Forecast Card | data-display | - | - | no dependencies detected | queued | - |
| 6 | Empty State | feedback | - | - | no dependencies detected | queued | - |
| 7 | Loading Indicator | unknown | - | - | no dependencies detected | queued | - |
| 8 | Mascot Illustration | unknown | - | - | no dependencies detected | queued | - |
| 9 | MetricBlock | data-display | CommuteDeltaCard | CommuteDeltaCard | used by 1 component; after 1 dependency; cycle fallback | queued | - |
| 10 | CommuteDeltaCard | data-display | DeltaAtmosphere, MetricBlock | MetricBlock | used by 1 component; after 2 dependencies | queued | - |

## Component Queue

| Batch | Order | Component | Category | Source spec | Design sources | Story source URL | Depends on | Used by | Product target | Story target | Decision | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B01 | 1 | DeltaAtmosphere | foundation | design-system/components/delta-atmosphere.md | ✓ delta-atmosphere.md | - | - | CommuteDeltaCard | src/components/DeltaAtmosphere/DeltaAtmosphere.tsx | src/components/DeltaAtmosphere/DeltaAtmosphere.stories.tsx | - | queued |
| B01 | 2 | Primary Button | primitive | design-system/components/primary-button.md | ✓ primary-button.md | - | - | - | src/components/PrimaryButton/PrimaryButton.tsx | src/components/PrimaryButton/PrimaryButton.stories.tsx | - | queued |
| B01 | 3 | Floating Navigation | navigation | - | high | - | - | - | src/components/FloatingNavigation/FloatingNavigation.tsx | src/components/FloatingNavigation/FloatingNavigation.stories.tsx | - | queued |
| B01 | 4 | Outfit Chip | data-display | - | medium | - | - | - | src/components/OutfitChip/OutfitChip.tsx | src/components/OutfitChip/OutfitChip.stories.tsx | - | queued |
| B02 | 5 | Weather Forecast Card | data-display | - | medium | - | - | - | src/components/WeatherForecastCard/WeatherForecastCard.tsx | src/components/WeatherForecastCard/WeatherForecastCard.stories.tsx | - | queued |
| B02 | 6 | Empty State | feedback | - | low | - | - | - | src/components/EmptyState/EmptyState.tsx | src/components/EmptyState/EmptyState.stories.tsx | - | queued |
| B02 | 7 | Loading Indicator | unknown | - | low | - | - | - | src/components/LoadingIndicator/LoadingIndicator.tsx | src/components/LoadingIndicator/LoadingIndicator.stories.tsx | - | queued |
| B02 | 8 | Mascot Illustration | unknown | - | high | - | - | - | src/components/MascotIllustration/MascotIllustration.tsx | src/components/MascotIllustration/MascotIllustration.stories.tsx | - | queued |
| B03 | 9 | MetricBlock | data-display | design-system/components/metric-block.md | ✓ metric-block.md | - | CommuteDeltaCard | CommuteDeltaCard | src/components/MetricBlock/MetricBlock.tsx | src/components/MetricBlock/MetricBlock.stories.tsx | - | queued |
| B03 | 10 | CommuteDeltaCard | data-display | design-system/components/commute-delta-card.md | ✓ commute-delta-card.md | - | DeltaAtmosphere, MetricBlock | MetricBlock | src/components/CommuteDeltaCard/CommuteDeltaCard.tsx | src/components/CommuteDeltaCard/CommuteDeltaCard.stories.tsx | - | queued |

## Batch Plan

| Batch | Components | Shared dependencies | Design sources | Dependency exit criteria | Validation | Status |
|---|---|---|---|---|---|---|
| B01 | DeltaAtmosphere, Primary Button, Floating Navigation, Outfit Chip | - | ✓ delta-atmosphere.md; ✓ primary-button.md; high; medium | all listed dependencies are done, reused, or accepted blocked decisions | co-located stories, source URLs, verification log | queued |
| B02 | Weather Forecast Card, Empty State, Loading Indicator, Mascot Illustration | - | medium; low; high | all listed dependencies are done, reused, or accepted blocked decisions | co-located stories, source URLs, verification log | queued |
| B03 | MetricBlock, CommuteDeltaCard | DeltaAtmosphere | ✓ metric-block.md; ✓ commute-delta-card.md | all listed dependencies are done, reused, or accepted blocked decisions | co-located stories, source URLs, verification log | queued |

## Decisions

| Date | Item | Decision | Reason | Follow-up |
|---|---|---|---|---|
|  |  |  |  |  |

## Figma Export Addon

| Requirement | Detected value | Status | Notes |
|---|---|---|---|
| Storybook `^10` |  |  |  |
| React |  |  |  |
| Bundled addon asset | `assets/figma-export-addon/` |  |  |
| Product vendor path | `.storybook/vendor/figma-export-addon/` |  |  |
| Project config | `.storybook/figma-export.config.ts` |  |  |
| `@storybook/icons` |  |  |  |
| Addon package |  |  |  |
| `.storybook/main.*` registration |  |  |  |
| `.storybook/preview.*` decorator/globals |  |  |  |
| Review helper / status API |  |  |  |
| Token prefix/options |  |  |  |

## Verification Log

| Batch | Command or check | Result | Notes |
|---|---|---|---|
|  |  |  |  |

