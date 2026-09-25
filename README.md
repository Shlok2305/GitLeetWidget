# DevWidgets — Windows Desktop Productivity Widgets

A modern, dark-themed Windows 10/11 desktop widget suite inspired by rounded productivity widget architecture. DevWidgets brings real-time GitHub contribution tracking, LeetCode problem solving progress, activity heatmaps, daily streaks, and customized coding goals directly to your Windows desktop.

---

## 🚀 Live App & Public Access

- **Public Shared Web App**: [https://ais-pre-7db7hsqu6tqvmbqri2vujb-918377544437.asia-east1.run.app](https://ais-pre-7db7hsqu6tqvmbqri2vujb-918377544437.asia-east1.run.app)
  *(Anyone can access and use this online without installing any software!)*
- **GitHub / Open Source Repository**: You can publish this codebase directly to GitHub, GitLab, or distribute it as a pre-built Windows desktop release.

---

## 📥 How to Install and Run DevWidgets on Windows

You have **two simple ways** to install and run DevWidgets on your computer:

### Option 1: Native Windows Desktop App (.exe / .msi) — Recommended

This runs as a borderless, transparent desktop widget application on Windows 10 or 11 with system tray support.

#### Step 1: Prerequisites
Ensure you have the following installed on your Windows machine:
1. **Node.js** (v18 or higher): Download from [nodejs.org](https://nodejs.org/).
2. **Rust & Cargo**: Run `winget install Rustlang.Rustup` in PowerShell or download from [rustup.rs](https://rustup.rs/).
3. **Microsoft C++ Build Tools**: Download via Visual Studio Installer (check *"Desktop development with C++"*).

#### Step 2: Clone & Install Dependencies
Open PowerShell or Command Prompt:
```bash
# Clone the repository (or extract downloaded ZIP)
git clone https://github.com/your-username/devwidgets.git
cd devwidgets

# Install project dependencies and Tauri CLI
npm install
npm install -D @tauri-apps/cli
```

#### Step 3: Run the Desktop Application
To launch directly on your desktop in development mode:
```bash
npx tauri dev
```

#### Step 4: Build Windows Installer (.exe / .msi)
To package a standalone Windows installer that you can keep or share with anyone:
```bash
npx tauri build
```
Once the build completes, your ready-to-use installer will be located at:
```text
src-tauri/target/release/bundle/nsis/DevWidgets_1.0.0_x64-setup.exe
src-tauri/target/release/bundle/msi/DevWidgets_1.0.0_x64_en-US.msi
```
Double-click `DevWidgets_1.0.0_x64-setup.exe` to install it just like any standard Windows desktop software.

---

### Option 2: Browser & Progressive Web App (PWA) Mode

If you don't want to install Rust or C++ tools, you can run or install DevWidgets via any modern browser (Chrome, Edge, Brave):

1. **Direct Web Access**:
   Open [https://ais-pre-7db7hsqu6tqvmbqri2vujb-918377544437.asia-east1.run.app](https://ais-pre-7db7hsqu6tqvmbqri2vujb-918377544437.asia-east1.run.app).
2. **Install as Windows App**:
   In Microsoft Edge or Google Chrome:
   - Click the **Install** button in the browser address bar (or menu `...` -> **Apps** -> **Install this site as an app**).
   - Check **"Open as window"** and click **Install**.
   - Pin it to your Windows Taskbar or Desktop. It will launch in its own standalone window without browser tabs or address bar.
3. **Or run locally with Node.js**:
   ```bash
   git clone https://github.com/your-username/devwidgets.git
   cd devwidgets
   npm install
   npm run dev
   ```
   Open `http://localhost:3000`.

---

## 🌐 Making This Project Public (Sharing with Others)

### 1. Share the Live Hosted URL
The easiest way to make this app public immediately is by sharing the deployed URL:
👉 **[https://ais-pre-7db7hsqu6tqvmbqri2vujb-918377544437.asia-east1.run.app](https://ais-pre-7db7hsqu6tqvmbqri2vujb-918377544437.asia-east1.run.app)**
Anyone with this link can view the widgets, test with their own GitHub & LeetCode usernames, and customize themes.

### 2. Publish to GitHub
To share the open-source repository publicly:
```bash
git init
git add .
git commit -m "feat: initial DevWidgets Windows desktop application"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/devwidgets.git
git push -u origin main
```
In your GitHub repository settings, make sure the repository visibility is set to **Public**.

### 3. Distribute Pre-built Windows Releases on GitHub
1. In your GitHub repository, click on **Releases** -> **Draft a new release**.
2. Tag your release as `v1.0.0`.
3. Drag and drop the generated `DevWidgets_1.0.0_x64-setup.exe` and `DevWidgets_1.0.0_x64_en-US.msi` into the release binaries section.
4. Anyone visiting your repository can download and run the `.exe` directly without needing Node.js or Rust installed.

---

## ⚙️ How to Configure GitHub & LeetCode

### GitHub Configuration
1. Click the **Settings** icon (gear in the top-right or on the Windows taskbar).
2. Open the **GitHub** tab.
3. Enter your **GitHub Username** (e.g. `torvalds` or your handle).
4. *(Optional)* Add a **GitHub Personal Access Token (PAT)**:
   - Go to [GitHub Settings -> Personal Access Tokens](https://github.com/settings/tokens).
   - Create a read-only token.
   - Adding a token raises the GitHub rate limit from 60 requests/hr to 5,000 requests/hr.
5. Click **Save GitHub Settings**. Your contribution graph, daily commits, and streaks will load immediately.

### LeetCode Configuration
1. Open the **LeetCode** tab in Settings.
2. Enter your public **LeetCode Username** (e.g. `neal_wu` or your username).
3. Click **Save LeetCode Settings**.
4. The widget will query public stats and display solved problems, difficulty bars (Easy/Medium/Hard), ranking, and submission calendar heatmap.
> **Note**: DevWidgets never asks for or stores passwords. Only public handles are used.

---

## 🖥️ Desktop Features & Controls

| Feature | How to Use |
|---|---|
| **Move Widgets** | Click and drag the widget header bar |
| **Resize Widgets** | Drag the resize handle at the bottom-right corner of any widget |
| **Snap to Grid** | Click the grid icon in the top toolbar to toggle 12px grid snapping |
| **Pin Always on Top** | Click the pin icon in the widget header or right-click -> *"Keep on top"* |
| **Inspect Day** | Click any square in the contribution heatmaps to see exact count & date |
| **Reset Layout** | Click the rotate arrow in the top toolbar to restore default layout |
| **Change Wallpaper** | Click the image icon in the top bar to toggle between Bloom Dark, Cyberpunk, Dusk, and Bloom Light |
| **System Tray** | Click the `^` tray icon on the taskbar to access quick controls |
| **Context Menu** | Right-click any widget or the desktop background for contextual actions |

---

## 🛠️ How the APIs Work

- **GitHub Service (`src/services/github/`)**:
  - `fetchGitHubUserProfile`: Queries `https://api.github.com/users/{username}` for profile info.
  - `fetchGitHubContributions`: Queries public mirrors (`github-contributions-api.jogruber.de` & `gh-calendar.rs`) and falls back to GraphQL if a PAT is present.
  - Streaks, week, and month totals are calculated in `src/utils/streak.ts`.
  - Responses are cached in `localStorage` for 30 minutes to stay within rate limits.

- **LeetCode Service (`src/services/leetcode/`)**:
  - Queries public statistics APIs (`leetcode-stats-api.herokuapp.com` and `alfa-leetcode-api.onrender.com`).
  - Decodes epoch timestamp calendar entries into daily problem counts.
  - Maps counts into 4 intensity levels: `0` (none), `1` (1 solved), `2` (2-3 solved), `3` (4+ solved).
  - Caches results for 30 minutes with instant manual refresh support.

---

## 📁 Where Local Settings Are Stored

- **Browser / PWA**: Stored in `localStorage`:
  - `devwidgets_settings_v1`: Theme, accent color, opacity, blur, usernames, and goals.
  - `devwidgets_widgets_v1`: Widget coordinates, dimensions, visibility, and z-index ordering.
  - `devwidgets_gh_cache_*`: Cached GitHub data.
  - `devwidgets_lc_cache_*`: Cached LeetCode data.
- **Windows Native (Tauri)**:
  `%APPDATA%\com.devwidgets.desktop\store.json` (typically `C:\Users\<User>\AppData\Roaming\com.devwidgets.desktop\`).

---

## License

Apache-2.0
