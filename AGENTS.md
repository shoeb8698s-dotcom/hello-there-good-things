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

- Register remote playlist sources in the shared source registry and assemble their groups in the playlist builder so fetching and output use the same configuration.
- Use the current TanStack Start entry APIs without supplying a router to StartClient or createStartHandler; the framework resolves the router automatically.
- Emit non-playing placeholders for zero-entry allow_empty sources in the builder, keeping live channel statistics unchanged; use a reserved .invalid URL so no real service is contacted for a placeholder.
