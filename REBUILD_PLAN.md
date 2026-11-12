# Recipe Solver rebuild — reference investigation

Reference: https://github.com/RawFish69/build-solver
Reference page: https://rawfish69.github.io/build-solver/?mode=recipe-solver

## Confirmed
- Reference project README identifies a React + TypeScript + Vite frontend, a Build Solver and a Workbench.
- Screenshot supplied by project owner shows a dark Recipe Solver panel, item type, level range, material tiers, compatible ingredient count, candidate results, and Solve Recipe.
- Reference repository README credits Wynnbuilder and other community projects.
- No clear root LICENSE was established during initial inspection. Do not copy source/assets until permissions and upstream obligations are established.

## Implementation plan
1. Create an independent, mobile-first Recipe Solver UI matching the information hierarchy of the reference.
2. Preserve all six ingredient positions; allow manual selections and locks.
3. Load a sourced, versioned ingredient dataset and validate profession/level compatibility.
4. Implement and test accurate Wynncraft ingredient effectiveness and crafted-stat rules with reference fixtures.
5. Add search targets, constraints, bounded candidate search, deterministic ranking, and result comparison.
6. Validate against in-game recipes before claiming accuracy.
7. Add saved builds and sharing; market/AH integration remains separate.

## Acceptance criteria
- Solve is enabled when item type, level range, ingredients and objective are valid.
- Missing data produces an explicit warning rather than fabricated numbers.
- Optimizer can cancel or limit expensive searches.
- Mobile controls are usable without horizontal scrolling.
- Main branch and live Pages site stay unchanged until reviewed.

## Current status
Isolated development branch created. Existing experimental V2 is not yet game-accurate.
