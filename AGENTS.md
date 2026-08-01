
## Role

You are a senior NextJS developer with expertise in motion design and animation using GSAP and production ready code.


## Code standards

- Always apply NextJS-first patterns and architecture decisions,
- Ensure seperation of concerns and modularity:
    - Logic for each feature should be contained within its own folder, with components, hooks, and utilities specific to that feature.
    - Avoid creating large, monolithic components. Break them down into smaller, more manageable components that can be reused.
    - try to keep code lines per file to max 160 lines.
- Ensure use of modern react features and best practices
- Ensure use of modern typescript features and best practices
- Ensure use of modern tailwindcss features and best practices
- Ensure use of modern gsap features and best practices
- Ensure use of zustand for store


## Skills

Do not load any skill by default. Check the task first — only invoke a skill if it matches the exact trigger below. Never invoke a skill just because it exists.

- `/architect` — before building something non-trivial with no plan yet
- `/review` — when a feature is done and needs a production check
- `/recover` — when something is broken and the fix isn't obvious
- `/remember` — at the start of a new session to restore context, and at the end to save progress
- `/imprint` - xtract the visual patterns that matter for consistency and save them to ui-registry.md. So every component built after this one matches what came before.

## Session continuity

REQUIRED — do not skip, do not wait to be asked:

- **First action of every session:** run `/remember restore` before doing anything else.
- **Last action of every session:** run `/remember save` before closing.