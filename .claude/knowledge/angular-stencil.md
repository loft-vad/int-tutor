# Modern Angular + Stencil Web Components (EAA integration)

Reference behind `src/data/angular.ts` and `src/data/web-components.ts`.
Targets **Angular 17–19** (signals era) and **Stencil 4**.

---

## Part 1 — Modern Angular (the interview-critical surface)

### Signals & reactivity (the headline change)
- `signal()`, `computed()`, `effect()` — fine-grained reactivity, no Zone.js required.
- `signal.set()` vs `signal.update()`; `untracked()` to read without subscribing.
- `linkedSignal()` (v19) — writable signal derived from a source that resets on source change.
- `resource()` / `rxResource()` (v19, experimental) — async data as a signal.
- Signal-based component APIs: `input()`, `input.required()`, `model()`, `output()`,
  `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()` — replacing the
  `@Input`/`@Output`/`@ViewChild` decorators.
- `toSignal()` / `toObservable()` bridge in `@angular/core/rxjs-interop`.
- **Zoneless change detection** (`provideExperimentalZonelessChangeDetection()`), and why
  signals are the prerequisite.

### Standalone components
- `standalone: true` (default from v19), `imports: []` on the component itself.
- `bootstrapApplication()` + `ApplicationConfig` replacing `AppModule`.
- `provideRouter()`, `provideHttpClient()`, `provideAnimations()` — the "provide" functions
  replacing `forRoot()` modules.
- Migration path from NgModules; when NgModules still appear (libraries, lazy legacy code).

### Built-in control flow (v17+)
- `@if` / `@else if` / `@else`, `@for` (**`track` is mandatory**), `@empty`, `@switch`.
- Why `@for` requires `track`, and why `track $index` is a smell for keyed data.
- `@defer` blocks with triggers (`on idle`, `on viewport`, `on interaction`, `on hover`,
  `on timer`, `when <expr>`, `prefetch on ...`) and `@placeholder` / `@loading` / `@error`.
  This is the framework-level answer to lazy hydration and LCP.

### Dependency injection
- Hierarchical injectors: `EnvironmentInjector` vs `ElementInjector`.
- `providedIn: 'root' | 'platform' | 'any'`; tree-shakable providers.
- `inject()` in field initializers vs constructor injection; injection context rules.
- `InjectionToken`, multi-providers, `@Optional`/`@Self`/`@SkipSelf`/`@Host`.
- Functional guards / resolvers / interceptors (`CanActivateFn`, `HttpInterceptorFn`) —
  class-based ones are deprecated.

### Change detection
- `Default` vs `OnPush`; what marks a component dirty under `OnPush` (input reference change,
  event from the template, `async` pipe emission, explicit `markForCheck()`).
- `ChangeDetectorRef.detectChanges()` vs `markForCheck()` vs `ApplicationRef.tick()`.
- `NgZone.runOutsideAngular()` for high-frequency work.
- `ExpressionChangedAfterItHasBeenCheckedError` — cause and correct fixes.

### RxJS in Angular
- Flattening operators: `switchMap` (cancel previous — typeahead), `mergeMap` (concurrent),
  `concatMap` (queue, order-preserving), `exhaustMap` (ignore while in flight — submit button).
- `takeUntilDestroyed()` (v16+) replacing the `destroy$` Subject pattern.
- Hot vs cold, `shareReplay({bufferSize:1, refCount:true})` and the leak it fixes/creates.
- Error handling: `catchError`, `retry`, `retryWhen` → `retry({delay})`.
- Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject.

### Forms
- Reactive vs template-driven; **typed reactive forms** (v14+): `FormControl<string|null>`,
  `NonNullableFormBuilder`, `FormGroup<{...}>`.
- Custom validators (sync/async), `ControlValueAccessor` for custom inputs.
- `FormArray` for dynamic forms; `updateOn: 'blur' | 'submit'`.

### Router
- Lazy loading via `loadComponent` / `loadChildren` with dynamic `import()`.
- Route-level providers, `withComponentInputBinding()` (route params → signal inputs).
- Guards as functions, resolvers, `Router.events`, `RouterOutlet` and named outlets.
- View transitions (`withViewTransitions()`), preloading strategies.

### SSR / hydration / performance
- `@angular/ssr`, `provideClientHydration()`; **non-destructive full hydration** vs the old
  destructive re-render.
- **Incremental hydration** (v19) — `@defer (hydrate on ...)`.
- SSR pitfalls: `window`/`document` access, `isPlatformBrowser`, `afterNextRender()` /
  `afterRender()`.
- `NgOptimizedImage` (`ngSrc`, `priority`, `fill`) for LCP.
- Build: esbuild-based application builder, `@angular/build`, budgets, source-map analysis.

### Testing
- `TestBed.configureTestingModule` with standalone imports, `provideHttpClientTesting()`.
- `fakeAsync`/`tick` vs `waitForAsync`; harnesses (`@angular/cdk/testing`).
- Testing signals (read directly — no subscription needed) and `effect()` with `TestBed.flushEffects()`.

### State management
- Signals + services as the default; `@ngrx/signals` SignalStore; NgRx Store/Effects when
  you need time-travel and strict event sourcing; when *not* to reach for NgRx.

### Security
- Built-in sanitization and `SecurityContext`; `DomSanitizer.bypassSecurityTrust*` risks.
- XSRF token handling in `HttpClient`, CSP + `ngCspNonce`, avoiding `innerHTML`.

---

## Part 2 — Stencil web components integrated into Angular (EAA)

### What Stencil is
A **compiler** that produces standards-based **Custom Elements** (Web Components), not a
runtime framework. Output is framework-agnostic: the same `<eaa-button>` runs in Angular,
React, Vue, or plain HTML. Used for design systems shared across an org's app estate —
the **EAA** pattern: one component library, many Angular applications.

Core Stencil ideas:
- TSX-authored components with a small (~
  a few KB) runtime; **lazy-loaded** components by default.
- Decorators: `@Component({tag, styleUrl, shadow})`, `@Prop()`, `@State()`, `@Event()`
  (`EventEmitter`), `@Listen()`, `@Method()` (must be `async` — cross-boundary calls are
  async), `@Element()`, `@Watch()`.
- Lifecycle: `connectedCallback` → `componentWillLoad` → `componentWillRender` → `render`
  → `componentDidRender` → `componentDidLoad` → (`componentWillUpdate`/`componentDidUpdate`)
  → `disconnectedCallback`.
- **Output targets**: `dist` (lazy loader), `dist-custom-elements` (tree-shakable, preferred
  for framework wrappers), `www`, `docs-readme`, and the **framework output targets**
  (`@stencil/angular-output-target`) that generate typed Angular wrapper components.

### Why plain custom elements are awkward in Angular (and the wrapper fixes it)
| Problem | Cause | Fix |
|---|---|---|
| `Can't bind to 'x' since it isn't a known property` | Angular template compiler doesn't know the tag | `CUSTOM_ELEMENTS_SCHEMA`, or better, generated wrappers |
| Complex objects/arrays don't reach the component | HTML attributes are strings; `[prop]` binding on an unknown element falls back to attributes | Property binding via a wrapper/directive, or `[attr.x]` only for primitives |
| Custom events don't work with `(myEvent)` | They do bind, but the payload is in `$event.detail`, and Angular has no typing | Generated wrappers re-emit typed `@Output()`s |
| `ngModel` / reactive forms don't bind | Custom elements aren't `ControlValueAccessor`s | `ValueAccessor` base classes from the Angular output target |
| Zone.js doesn't know about events fired inside the component | Events are dispatched outside Angular's patched APIs in some setups | `NgZone.run()` in the wrapper, or zoneless + signals |
| SSR breaks | Custom elements need `customElements`, absent on the server | `defineCustomElements()` guarded by `isPlatformBrowser`, or Stencil hydrate app |

### Integration recipe (the interview answer)
1. Build the library with `dist-custom-elements` + `@stencil/angular-output-target`.
2. Publish two packages: `@eaa/core` (the custom elements) and `@eaa/angular` (wrappers).
3. In the Angular app, import the generated standalone wrapper components (or the wrapper
   NgModule in older apps).
4. Call `defineCustomElements()` once at bootstrap — browser-only.
5. If you skip wrappers, add `CUSTOM_ELEMENTS_SCHEMA` to the component/module and accept
   losing type-safety and forms integration.

### Styling & Shadow DOM
- `shadow: true` gives real encapsulation — outer CSS cannot leak in. Theming must go
  through **CSS custom properties** (`--eaa-button-bg`) and `::part()` / `:host` /
  `:host-context()`.
- `scoped: true` gives Stencil's own scoping without a shadow root — allows global CSS to
  reach in, useful when a legacy Angular app's styles must apply.
- `::slotted()` targets slotted light-DOM content, one level only.
- Angular `ViewEncapsulation.Emulated` styles **do not** cross into a shadow root — a
  classic bug report from app teams.

### Slots & content projection
- Stencil `<slot>` / named `<slot name="footer">` ≈ Angular `<ng-content select="...">`.
- Angular content projected into a Stencil component stays in the light DOM and is styled by
  the *Angular app's* styles, not the component's shadow styles.

### Forms
- `ControlValueAccessor` wrappers translate `value` props and `change`/`input` events into
  Angular forms. Without them, `formControlName` silently does nothing.

### Testing
- Stencil side: `newSpecPage()` (fast, jsdom) and `newE2EPage()` (Puppeteer, real browser —
  required to test Shadow DOM and events properly).
- Angular side: wrappers behave like normal components; add
  `CUSTOM_ELEMENTS_SCHEMA` in `TestBed` when using raw custom elements.

### Versioning & governance (the senior-level answer)
- Custom elements register globally by tag name — **two versions of the same tag on one page
  collide**. Mitigations: strict single-version policy via peer deps, a version-suffixed tag
  prefix for breaking majors, or module federation with a shared singleton.
- Breaking changes: props and events are the public API contract; treat `@Method()`,
  `@Event()` names and `::part()` names as semver-relevant.
- Bundle size: prefer `dist-custom-elements` + tree shaking over the lazy `dist` loader when
  the consumer is a single app; the lazy loader wins when many components load conditionally.

### Accessibility
- Shadow DOM breaks `aria-labelledby`/`for` across the boundary — IDs are scoped per root.
  Fixes: put the label inside the same shadow root, use `aria-label`, or use ARIA element
  reflection (`ariaLabelledByElements`) where available.
- Focus: `delegatesFocus: true` on the shadow root, and `:focus-visible` inside.
