# Phase 3.1 Fix Log
## Code Changes for Tests 7, 8, 9 Stability

**Date:** 2026-03-07  
**Scope:** Race condition, stale UI, and rapid-search robustness

---

## Fix 1: SearchBar — Race Condition Protection

| Field | Value |
|-------|-------|
| File | `src/components/search/SearchBar.tsx` |
| Change | Added `searchIdRef` to track the latest search; ignore geocode results from superseded searches |
| Before | `if (!trimmed || loading) return;` — blocked new searches while loading |
| After | `if (!trimmed) return;` — allow new searches; use `mySearchId` to ignore stale results |
| Implementation | `const mySearchId = ++searchIdRef.current` at start; before `setLocation`/`clearLocation`/`setError`, check `if (mySearchId !== searchIdRef.current) return`; in `finally`, only `setLoading(false)` if `mySearchId === searchIdRef.current` |
| Bug fixed | Older geocode result overwriting newer; Test 9 blocked when Test 8 still loading |

---

## Fix 2: SearchBar — Allow Submit While Loading

| Field | Value |
|-------|-------|
| File | `src/components/search/SearchBar.tsx` |
| Change | Removed `loading` from button `disabled`; removed `disabled={loading}` from input |
| Before | `disabled={loading || !query.trim()}` on button; `disabled={loading}` on input |
| After | `disabled={!query.trim()}` on button; input not disabled |
| Bug fixed | Rapid consecutive searches blocked at UI level; user could not submit Test 9 while Test 8 was loading |

---

## Fix 3: WhatsClosest — Stale-While-Loading Guard

| Field | Value |
|-------|-------|
| File | `src/features/closest/WhatsClosest.tsx` |
| Change | Use `(isPending || isLoading) && !data` for loading skeleton instead of `isLoading && !data` |
| Before | `if (isLoading && !data)` — TanStack Query v5: `isLoading = isPending && isFetching`; brief `fetchStatus: 'idle'` can make `isLoading` false |
| After | `if ((isPending || isLoading) && !data)` — show loading whenever we have no data and query is pending |
| Bug fixed | Brief flash of "No civic places data available" or old-location data when coordinates change |

---

## Fix 4: use-happening — Stale-While-Loading Guard

| Field | Value |
|-------|-------|
| File | `src/features/happening/use-happening.ts` |
| Change | For each category (code violations, building permits, 311), treat `isPending && !data` as loading |
| Before | `if (codeViolationsQuery.isLoading)` — same edge case as WhatsClosest |
| After | `if (codeViolationsQuery.isLoading || (codeViolationsQuery.isPending && !codeViolationsQuery.data))` |
| Bug fixed | What's Happening Nearby showing "No nearby X" or previous-location data during key transition |

---

## No Changes

- **Query keys** — Already correct; no changes
- **Geocoding** — Verified working for 2500 Mobile Hwy; no changes
- **Phase 1, 2, 2.1** — Unchanged
- **UI design / product narrative** — Unchanged

---

## Summary

| Fix | File | Purpose |
|-----|------|---------|
| 1 | SearchBar.tsx | Race condition — latest search wins |
| 2 | SearchBar.tsx | Allow submit while loading |
| 3 | WhatsClosest.tsx | Stale UI guard |
| 4 | use-happening.ts | Stale UI guard |

**Total files modified:** 3  
**Total fixes:** 4
