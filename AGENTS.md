<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep all MVP data and interactions client-side using centralized mock data because the approved demo explicitly excludes backend services.
- Use dedicated TanStack routes for every navigation destination so each major module remains directly accessible and metadata-ready.

## Technical decisions
- Keep cross-module demo state in a client-side React context backed by centralized mock seed data, because this MVP explicitly excludes backend persistence.
- Circuit generation, driver assignment, crisis redistribution and compliance alerts are computed by pure functions in src/lib/transport-engine.ts, with the live plan held in DemoProvider, so every page derives from one consistent simulated organization.
