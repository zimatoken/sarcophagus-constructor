# Sarcophagus Constructor v2.4.0 — Production Hardening

## Scope
A focused hardening release based on v2.3.0. Existing project flow and module library are preserved.

## Changes
- Strict JSON import validation before replacing the active draft.
- Imported project data is normalized against known fields and the 27-module allowlist.
- Text values are bounded to avoid oversized or malformed imported payloads.
- Help dialog now has dialog semantics, focus management, keyboard containment, and complete event-listener cleanup.
- Diagnostic mode is accurately described as a local keyword heuristic; it does not call an AI model.
- Improved visible keyboard focus and narrow-screen layout.
- Added regression coverage for complex draft restoration and FULL document contents.

## Verification
- `npm test`: 17 tests passing.
- `npm run check`: passing.
- 27 unique modules validated.
- Browser manual E2E is still required on the target Windows/Chrome environment before declaring release acceptance.

## Compatibility
- No runtime dependencies added.
- No backend or network calls added.
- Local-first draft storage retained.
- Existing JSON schema v2 accepted; unwrapped legacy project objects remain accepted when their data shape is valid.
