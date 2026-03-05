# Contexts

React context providers that manage global application state. The `contexts/` folder contains a single file, but it's one of the most important in the codebase — it manages authentication, reading progress, and game scores.

```
contexts/
└── AuthContext.tsx    # Auth state, progress tracking, game scores, leaderboard
```

---

## AuthContext.tsx

The global authentication and user state provider. This wraps the entire application and makes user data available to every component via the `useAuth()` hook.

### What It Manages

| State | Description |
|---|---|
| `user` | Current user object (`{ id, email, firstName }`) or `null` |
| `readSlugs` | Set of pattern slugs the user has marked as read |
| `scores` | Map of pattern slug → best game score per pattern |
| `leaderboard` | Top 20 users globally ranked by average game score |
| `userRank` | The current user's position on the leaderboard |
| `loading` | Whether the auth state is still being determined |

### Key Functions

| Function | What It Does |
|---|---|
| `signup(data)` | Calls `POST /api/signup`, stores user in state + localStorage |
| `login(email, password)` | Calls `POST /api/auth/login`, stores user in state + localStorage |
| `logout()` | Clears user state and localStorage, redirects to homepage |
| `markRead(slug)` | Calls `POST /api/progress` to mark a pattern as read, updates local state |
| `saveGameScore(slug, score)` | Calls `POST /api/game-scores` to save a game result, refreshes leaderboard |
| `progressPercent` | Computed value: `(readSlugs.size / totalPatterns) * 100` |

### How Sessions Work

The app uses a simple session mechanism based on localStorage (no JWTs or cookies):

1. On **signup/login**: the user's email is saved to `localStorage` with a 90-day expiry timestamp
2. On **page reload**: the provider reads the email from localStorage, calls `POST /api/auth/verify` to confirm the account still exists, and restores the session
3. On **logout**: localStorage is cleared

This approach means sessions are per-device and don't survive clearing browser data.

### Analytics Integration

The provider integrates with PostHog to track:
- `user_signed_up` — when a new user registers
- `user_logged_in` — when a user signs in
- `pattern_read` — when a user reads a pattern (with the slug)

It also calls `posthog.identify()` when the user state changes so analytics events are attributed to the correct user.

### Exports

- **`AuthProvider`** — the context provider component (wraps the app)
- **`useAuth()`** — hook to access auth state and functions from any component
- **`PatternScore`** — interface for game score data
- **`LeaderboardEntry`** — interface for leaderboard data
