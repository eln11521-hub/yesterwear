# Storybook Component Build Plan

- Design-system root: `/Users/fengyunqi/Projects/yesterday-weather-widget/design-system`
- Package root: `/Users/fengyunqi/Projects/yesterday-weather-widget`
- Source trace: `/Users/fengyunqi/Projects/yesterday-weather-widget/design-system/STORYBOOK_SOURCE_TRACE.md`
- Components ordered: 10
- Batches: 3
- Skipped components: 0
- Dependency cycles: 1

## Recommended Build Order

| Order | Batch | Component | Category | Depends on | Used by | Story source URL | Build reason |
|---|---|---|---|---|---|---|---|
| 1 | B01 | DeltaAtmosphere | foundation | - | CommuteDeltaCard | - | core dependency tier; used by 1 component |
| 2 | B01 | Primary Button | primitive | - | - | - | core dependency tier |
| 3 | B01 | Floating Navigation | navigation | - | - | - | no dependencies detected |
| 4 | B01 | Outfit Chip | data-display | - | - | - | no dependencies detected |
| 5 | B02 | Weather Forecast Card | data-display | - | - | - | no dependencies detected |
| 6 | B02 | Empty State | feedback | - | - | - | no dependencies detected |
| 7 | B02 | Loading Indicator | unknown | - | - | - | no dependencies detected |
| 8 | B02 | Mascot Illustration | unknown | - | - | - | no dependencies detected |
| 9 | B03 | MetricBlock | data-display | CommuteDeltaCard | CommuteDeltaCard | - | used by 1 component; after 1 dependency; cycle fallback |
| 10 | B03 | CommuteDeltaCard | data-display | DeltaAtmosphere, MetricBlock | MetricBlock | - | used by 1 component; after 2 dependencies |

## Batch Plan

| Batch | Components | Shared dependencies | Tiers | Rationale | Exit criteria |
|---|---|---|---|---|---|
| B01 | DeltaAtmosphere, Primary Button, Floating Navigation, Outfit Chip | - | foundation, primitive, navigation, data-display | Establish foundation components before composed patterns. | component/page folder, co-located story, source URL parameters, queue status, and verification log updated |
| B02 | Weather Forecast Card, Empty State, Loading Indicator, Mascot Illustration | - | data-display, feedback, unknown | Build composed patterns after their lower-level dependencies are available. | component/page folder, co-located story, source URL parameters, queue status, and verification log updated |
| B03 | MetricBlock, CommuteDeltaCard | DeltaAtmosphere | data-display | Continue dependency-ordered data-display implementation. | component/page folder, co-located story, source URL parameters, queue status, and verification log updated |

## Dependency Details

| Component | Depends on | Dependency reason | Source refs | Spec file |
|---|---|---|---|---|
| DeltaAtmosphere | - | - | ✓ delta-atmosphere.md | design-system/components/delta-atmosphere.md |
| Primary Button | - | - | ✓ primary-button.md | design-system/components/primary-button.md |
| Floating Navigation | - | - | high | - |
| Outfit Chip | - | - | medium | - |
| Weather Forecast Card | - | - | medium | - |
| Empty State | - | - | low | - |
| Loading Indicator | - | - | low | - |
| Mascot Illustration | - | - | high | - |
| MetricBlock | CommuteDeltaCard | CommuteDeltaCard: dependency phrase in component spec | ✓ metric-block.md | design-system/components/metric-block.md |
| CommuteDeltaCard | DeltaAtmosphere, MetricBlock | DeltaAtmosphere: dependency phrase in component spec; MetricBlock: dependency phrase in component spec | ✓ commute-delta-card.md | design-system/components/commute-delta-card.md |

## Dependency Cycles

- MetricBlock -> CommuteDeltaCard -> MetricBlock

## Skipped Components

- None.

## Usage Notes

- Implement components in the recommended order unless product discovery proves an existing component can be reused first.
- Do not build a composed component before its listed dependencies are implemented, reused, or explicitly marked blocked with a reason.
- Implement typographic/text-lockup components as editable, token-backed display components; do not flatten them into generic heading/subheading styles.
- After each component, update the queue/implementation map before starting the next component.
- Put new component stories beside their component files; reserve root `stories/` or `src/stories/` for foundation guides/docs.
- Put requested page/screen implementations in dedicated page folders with co-located page stories.
- If a dependency is inferred incorrectly, record the correction in the implementation map and update the queue ordering.

