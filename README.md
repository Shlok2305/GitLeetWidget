# DevWidgets — Windows Desktop Productivity Widgets

A modern, dark-themed Windows 10/11 desktop widget suite inspired by rounded productivity widget architecture. DevWidgets brings real-time GitHub contribution tracking, LeetCode problem solving progress, activity heatmaps, daily streaks, and customized coding goals directly to your Windows desktop.

---

## Features

- **Windows Desktop Widget System**:
  - Independent, movable, and resizable widgets
  - Rounded corners (`26px`) with dark charcoal aesthetic (`#18191F` & `#1E2026`)
  - Acrylic/Mica glassmorphism with real-time backdrop blur and opacity adjustments
  - Snapping to a 12px desktop grid
  - "Always on Top" pin mode per widget or globally
  - State persistence in local storage
  - Built-in Windows 11 desktop wallpaper previews (Bloom Dark, Bloom Light, Cyberpunk Grid, Mountain Dusk)
  - Interactive Windows 11 Taskbar with Start menu launcher and live clock

- **GitHub Activity Widget**:
  - Profile avatar, username, and direct link to profile
  - Total contributions this year & overall
  - Current streak and all-time longest streak
  - This week, this month, and today's commit counters
  - Interactive square-cell contribution heatmap (3m, 6m, 12m views) with 5 intensity levels
  - Day inspection popover (e.g., *"12 contributions — September 24"*)
  - Official GitHub REST & GraphQL API support with optional Personal Access Token (5,000 req/hr)

- **LeetCode Progress Widget**:
  - Problems solved counter with circular progress indicator (`59 / 4060`)
  - Easy, Medium, and Hard difficulty breakdowns with visual progress bars
  - Global ranking and acceptance rate
  - Dedicated LeetCode square activity heatmap (0 = dark, 1 = light green, 2-3 = medium green, 4+ = bright green)
  - Today, this week, and this month problem solved counters

- **Daily Coding Progress ("Today's Progress")**:
  - Dual progress bars for today's LeetCode problems and GitHub commits
  - Active joint daily coding streak

- **Coding Progress Dashboard (Combined)**:
  - Side-by-side LeetCode & GitHub progress cards
  - Stacked dual activity timeline grids

- **Goal & Target Widget**:
  - Configurable Monthly, Weekly, and Daily targets
  - In-widget inline numerical target editing

- **Quick Stats Widget**:
  - Compact summary of streaks, solved problems, and total commits

---

## 1. How to Install Dependencies

Ensure you have [Node.js](https://nodejs.org/) (v18 or newer) and `npm` installed.

```bash
# Clone the repository
git clone https://github.com/your-username/devwidgets.git
cd devwidgets

# Install npm dependencies
npm install
```

For building native Windows binaries (`.exe`), you will also need:
- [Rust](https://www.rust-lang.org/tools/install) (via `rustup`)
- Microsoft C++ Build Tools (via Visual Studio Installer with "Desktop development with C++")

---

## 2. How to Run in Development

To start the Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

To run with the native Tauri Windows desktop window:

```bash
npm run tauri dev
```

---

## 3. How to Configure GitHub

1. Click the **Settings** icon (gear) in the top-right toolbar or right-click any widget and choose **Settings**.
2. Navigate to the **GitHub** tab.
3. Enter your **GitHub Username** (e.g., `torvalds` or your handle).
4. *(Optional)* Provide a **GitHub Personal Access Token (PAT)**:
   - Go to [GitHub Settings -> Developer Settings -> Personal Access Tokens -> Fine-grained tokens](https://github.com/settings/tokens).
   - Generate a token with public read permissions.
   - Pasting this token raises the GitHub rate limit from 60 requests/hour to 5,000 requests/hour.
5. Click **Save GitHub Settings**. Your contribution graph and streaks will immediately sync.

---

## 4. How to Configure LeetCode

1. In the **Settings** modal, switch to the **LeetCode** tab.
2. Enter your public **LeetCode Username** (e.g., `neal_wu` or your username).
3. Click **Save LeetCode Settings**.
4. DevWidgets will query the public profile data and populate problem counts, rankings, acceptance rate, and calendar activity.
> **Note**: DevWidgets never requests or stores your LeetCode password.

---

## 5. How the APIs Work

- **GitHub Service (`src/services/github/`)**:
  - `fetchGitHubUserProfile`: Queries `https://api.github.com/users/{username}` for profile data.
  - `fetchGitHubContributions`: Queries public contribution mirrors (`github-contributions-api.jogruber.de` & `gh-calendar.rs`) to retrieve daily submission counts and intensity levels. If a PAT is supplied, it executes a GraphQL query against `https://api.github.com/graphql`.
  - Computes streaks, week, month, and day totals in `src/utils/streak.ts`.
  - Caches results in `localStorage` for 30 minutes to eliminate redundant API requests.

- **LeetCode Service (`src/services/leetcode/`)**:
  - Queries public statistics endpoints (`leetcode-stats-api.herokuapp.com` and `alfa-leetcode-api.onrender.com`).
  - Decodes the `submissionCalendar` timestamps (epoch seconds) into daily problem counts.
  - Maps counts into 4 intensity tiers:
    - `0`: No submissions
    - `1`: 1 problem solved
    - `2`: 2–3 problems solved
    - `3`: 4+ problems solved
  - Caches results locally for 30 minutes with instant manual refresh support.

---

## 6. How to Build the Windows `.exe`

DevWidgets uses Tauri to generate a lightweight, secure Windows executable.

```bash
# Compile web assets and build Windows installer (.msi / .exe)
npm run tauri build
```

The output installer will be located in:
```
src-tauri/target/release/bundle/nsis/DevWidgets_1.0.0_x64-setup.exe
src-tauri/target/release/bundle/msi/DevWidgets_1.0.0_x64_en-US.msi
```

---

## 7. How to Configure Windows Startup

### In-App Setting:
1. Open **Settings -> General**.
2. Toggle the **Start with Windows** switch to **ON**.

### Windows 10/11 Settings:
1. Open Windows **Settings** (`Win + I`).
2. Go to **Apps -> Startup**.
3. Locate **DevWidgets** and toggle it **On**.

---

## 8. Where Local Settings Are Stored

- **Browser Dev Mode**:
  Stored in browser `localStorage` under:
  - `devwidgets_settings_v1`: Theme, accent color, usernames, goals, opacity, blur, grid snapping.
  - `devwidgets_widgets_v1`: Coordinates (`x`, `y`), dimensions (`width`, `height`), visibility, and z-index ordering for each widget.
  - `devwidgets_gh_cache_{username}`: Cached GitHub profile & contribution calendar.
  - `devwidgets_lc_cache_{username}`: Cached LeetCode statistics & submission history.

- **Windows Native (Tauri)**:
  Stored in the Windows user application directory:
  `%APPDATA%\com.devwidgets.desktop\store.json`
  (Typically `C:\Users\<YourUser>\AppData\Roaming\com.devwidgets.desktop\`).

---

## License

Apache-2.0
