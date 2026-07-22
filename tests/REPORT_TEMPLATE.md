# Test Run Report

Copy this file to `REPORT_<YYYY-MM-DD>_<player|code>.md` and fill it in at the
end of every meaningful run. Both the player agent and the code agent use the
same template so the hand-off is symmetrical.

## Metadata

- **Agent:** player | code
- **Date (UTC):**
- **Foundry build (player only):**
- **System version under test:** (from `system.json#version`)
- **Migration checklist step(s) exercised:** e.g. 1, 3, 11

## Inputs

- **Raw test report:** path to `tests/.vitest-report.json` (code) or pasted
  `window.__rt2ePlayerReport` blob (player).
- **Commits / branches tested:**
- **Special preconditions:** new world / migrated world / nested-heavy world.

## Summary

| Layer | Passed | Failed | Pending | Notes |
| --- | --- | --- | --- | --- |
| Static | | | | |
| Player scripts (.rt2e) | | | | |
| Unit (Vitest) | | | | |
| Quench (in-Foundry) | | | | |

## Failures

For each failure, fill in one block. Be specific - the *other* agent reads
these to decide what to do next.

### Failure 1

- **Test path:** e.g. `tests/quench/data-models.test.mjs > actor subtypes round-trip > creates ... acolyte`
- **Migration checklist step:** e.g. 6 (Sheet migration - actor sheets)
- **Symptom:**
- **Suspected cause:**
- **Reproduction:**
- **Hand-off:** which agent should pick this up, and what artefact they should
  produce (new Vitest test? new Quench `it()`? code patch?).

## Regressions opened

List every defect this run discovered that was passing in the previous report.

## New tests added this run

List `path::testName` for each test added. The *other* agent reads this list
to know what surface is now covered.

## Outstanding `it.todo` / known gaps

List anything intentionally left red so the next run can decide whether to
schedule it.

## Sign-off

- [ ] All required checklist steps for this run are either green or have a
      tracked failure entry above.
- [ ] Report saved as `REPORT_<date>_<agent>.md` in `tests/`.
