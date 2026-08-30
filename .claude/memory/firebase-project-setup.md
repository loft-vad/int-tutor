# Firebase project setup — the parts that are easy to get wrong

Live project: **`int-tutor`** (project number `510184232670`), dedicated to this
app. An earlier attempt reused an unrelated project and hit two problems worth
remembering: it had **Realtime Database, not Firestore** (they are different
products — a `databaseURL` in the config is the tell), and a shared project means
one ruleset and one user pool for two apps.

## Required console steps

Firestore is **not** enabled by default. A project without it fails with
`Cloud Firestore API has not been used in project X before or it is disabled` —
distinguishable from a working-but-locked database, which returns
`PERMISSION_DENIED`. That difference is a fast health check.

1. **Databases & Storage → Firestore → Create database** (region is permanent)
2. **Security → Authentication → Get started** (a splash screen until clicked)
3. **Sign-in method → Anonymous → Enable** — required
4. **Sign-in method → Google → Enable** + set a **support email** (Save is
   rejected without one) — required for cross-device, see below
5. **Firestore → Rules** — publish `firestore.rules` from the repo root
6. **Authentication → Settings → Authorized domains** — add `loft-vad.github.io`

Console navigation moved: Authentication is under **Security**, not the old
"Build" section. Firestore is under **Databases & Storage**.

## Anonymous alone is NOT cross-device sync

| Setup | Result |
|---|---|
| Anonymous only | Each browser gets its **own** uid — a per-device cloud backup, not sync |
| Anonymous + Google | Signing in links devices to the **same** uid — real sync |

Anonymous still earns its place: it makes the app useful before sign-in, and
`linkWithPopup` upgrades that account **keeping the same uid**, so pre-sign-in
progress carries over instead of being stranded.

Authorized domains gate **OAuth** sign-in only; anonymous works on any origin.

## Rules

Publishing **replaces** a database's entire ruleset — it never merges. And a
trailing `match /{document=**} { allow read, write: if false; }` is a **no-op**:
Firestore denies by default and `allow` rules are OR'd, so it cannot lock down
anything.

Firebase's production-mode default is deny-all, which blocks the app entirely.
Copy `firestore.rules` **from the repo into the console**, not the reverse.

## The web API key is not a secret

`NEXT_PUBLIC_FIREBASE_API_KEY` is a public project identifier that ships in the
JS bundle by design. Security comes from `firestore.rules`, authorized domains,
and optionally App Check. Do **not** confuse it with a Google Cloud API key that
authorizes billed API calls — that kind must never go near a `NEXT_PUBLIC_*` var,
because those are inlined into publicly readable JavaScript.

## Verifying without a browser

The whole path can be exercised over REST with just the public key — sign in
anonymously, write and read your own document, confirm another uid is denied,
then delete the probe doc and the account. This proves rules and auth are correct
and cleanly separates server config problems from client bugs. (It does **not**
prove the SDK path works — see [[sync-concurrency]] for a bug that passed this
test and still failed in the browser.)

Related: [[sync-concurrency]], [[deploy-and-auth]], [[storage-seam]]
