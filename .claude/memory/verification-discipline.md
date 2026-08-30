# Green CI does not mean the app works — verify in a browser

Three bugs shipped through a fully green `npm run check` (lint + `tsc --noEmit` +
content validation) and a successful GitHub Pages deploy. All three made the app
visibly broken. None was detectable without loading the page.

| Bug | What CI saw | What the user saw |
|---|---|---|
| Sync `permission-denied` | ✅ compiles | "Sync failed" on every load |
| Font never applied | ✅ compiles | Entire app rendered in Times (a serif) |
| Settings unreachable | ✅ compiles | No way to open Settings at all |

The pattern: **each feature was correct but not connected.** Type checking proves
the parts are well-formed; it cannot prove they are wired together. Static
analysis has nothing to say about "is this component reachable", "does this CSS
variable get applied", or "does this request carry the right auth token".

## The rule

Any change to storage, auth, styling, or navigation gets loaded in a real browser
before it is called done. `/browse` does this headlessly:

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B goto http://localhost:PORT/page.html
$B console                 # errors — the thing that actually diagnoses
$B js "getComputedStyle(document.body).fontFamily"
$B js "document.body.innerText.includes('Expected text')"
```

## Errors must reach the console

The sync bug took an entire debugging session because `SyncedAdapter` swallowed
failures into component state and logged nothing. There was no console output to
read — the UI just said "Sync failed".

`SyncedAdapter` now logs `[sync] pull failed:` / `[sync] push failed:` with the
provider error **code** (`permission-denied` vs `unavailable` vs
`unauthenticated` need completely different fixes; the bare message does not
distinguish them). **Do not remove that logging.** Swallowing an error into state
makes the failure undebuggable from outside.

## Verify the measurement before trusting the conclusion

Four false conclusions were reached during this session, each from a bad probe,
and each sent the investigation somewhere pointless:

| False conclusion | Actual cause |
|---|---|
| "All topic routes 404" | Test URL had a double slash — base already ended in `/` |
| "SyncPanel is not in the bundle" | `grep chunks/*.js` is not recursive; it lives in `chunks/app/settings/` |
| "Firebase config did not deploy" | Regex missed the chunk-map entries; config was present |
| "Firestore rejects the write" | Rules were correct; the request carried the wrong uid |

Rule: when a probe reports something surprising, **test the probe against a known-good
case first**. Confirming the method finds the config in the local build (where it
is definitely present) would have caught two of these immediately.

Related: [[sync-concurrency]], [[ui-wiring-gotchas]]
