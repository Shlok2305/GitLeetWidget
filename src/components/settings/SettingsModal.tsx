import React, { useState } from 'react';
import { useSettings } from '../../store/settingsStore';
import { widgetActions, useWidgets } from '../../store/widgetStore';
import {
  X,
  Settings,
  Github,
  Code2,
  LayoutGrid,
  Monitor,
  RefreshCw,
  Palette,
  Shield,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'general' | 'github' | 'leetcode' | 'widgets' | 'desktop';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'general',
}) => {
  const [settings, updateSettings] = useSettings();
  const [widgets] = useWidgets();
  const [activeTab, setActiveTab] = useState<'general' | 'github' | 'leetcode' | 'widgets' | 'desktop'>(
    initialTab
  );

  // Form states
  const [githubUser, setGithubUser] = useState(settings.githubUsername);
  const [githubToken, setGithubToken] = useState(settings.githubToken || '');
  const [leetcodeUser, setLeetcodeUser] = useState(settings.leetcodeUsername);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSaveAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      githubUsername: githubUser.trim(),
      githubToken: githubToken.trim() || undefined,
      leetcodeUsername: leetcodeUser.trim(),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#16171d] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">DevWidgets Settings</h2>
              <p className="text-xs text-slate-400">Windows 10/11 Desktop Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-white/5 gap-2 bg-white/[0.01]">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'general'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> General
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'github'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" /> GitHub
          </button>
          <button
            onClick={() => setActiveTab('leetcode')}
            className={`px-3 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'leetcode'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> LeetCode
          </button>
          <button
            onClick={() => setActiveTab('widgets')}
            className={`px-3 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'widgets'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Widgets
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-3 py-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'desktop'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop & Wallpaper
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Theme & Palette */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Theme Appearance
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['dark', 'amoled', 'light'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => updateSettings({ theme: t })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        settings.theme === t
                          ? 'border-emerald-400 bg-emerald-500/10 text-white shadow-lg'
                          : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="text-xs font-bold capitalize">{t}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {t === 'dark' ? 'Charcoal #18191F' : t === 'amoled' ? 'Pure Black #000' : 'Clean Slate'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {(['green', 'emerald', 'cyan', 'amber', 'blue'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ accentColor: color })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border capitalize flex items-center gap-2 transition-all ${
                        settings.accentColor === color
                          ? 'border-white/40 bg-white/10 text-white'
                          : 'border-white/5 bg-white/[0.02] text-slate-400 hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          color === 'green'
                            ? 'bg-[#39d353]'
                            : color === 'emerald'
                            ? 'bg-[#10b981]'
                            : color === 'cyan'
                            ? 'bg-[#06b6d4]'
                            : color === 'amber'
                            ? 'bg-[#f59e0b]'
                            : 'bg-[#3b82f6]'
                        }`}
                      />
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity & Blur Sliders */}
              <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Widget Opacity</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {Math.round(settings.globalOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1.0"
                    step="0.02"
                    value={settings.globalOpacity}
                    onChange={(e) => updateSettings({ globalOpacity: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Mica / Glass Blur</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {settings.globalBlur}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    step="2"
                    value={settings.globalBlur}
                    onChange={(e) => updateSettings({ globalBlur: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Snap to Grid
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Align widgets neatly to 12px grid when moving or resizing
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.snapToGrid}
                    onChange={(e) => updateSettings({ snapToGrid: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <div className="h-px bg-white/5" />

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Start with Windows
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Launch widgets automatically on Windows 10/11 startup
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.startWithWindows}
                    onChange={(e) => updateSettings({ startWithWindows: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <div className="h-px bg-white/5" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Auto-Refresh Interval
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Fetch fresh statistics in background
                    </span>
                  </div>
                  <select
                    value={settings.autoRefreshIntervalMinutes}
                    onChange={(e) =>
                      updateSettings({ autoRefreshIntervalMinutes: parseInt(e.target.value) })
                    }
                    className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-white"
                  >
                    <option value={5}>Every 5 minutes</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every 1 hour</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* GITHUB TAB */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Github className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">GitHub Account Configuration</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  DevWidgets queries official GitHub REST & GraphQL APIs to display your public
                  contributions, streaks, and heatmap grids.
                </p>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="e.g. torvalds or your username"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    GitHub Personal Access Token (Optional)
                  </label>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_... (Increases rate limit from 60 to 5,000 requests/hr)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    No private repository permissions required. Stored securely in local Windows app storage.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setGithubUser('');
                      setGithubToken('');
                      updateSettings({ githubUsername: '', githubToken: undefined });
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Disconnect Account
                  </button>

                  <button
                    onClick={handleSaveAccounts}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Save GitHub Settings
                  </button>
                </div>
              </div>

              {savedNotice && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
                  <Check className="w-4 h-4" /> Settings updated successfully! Refreshing data...
                </div>
              )}
            </div>
          )}

          {/* LEETCODE TAB */}
          {activeTab === 'leetcode' && (
            <div className="space-y-4">
              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">LeetCode Account Configuration</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Connect your public LeetCode handle to track problem solving counts, difficulty
                  breakdowns, streaks, and submission calendar heatmaps.
                </p>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">
                    LeetCode Username
                  </label>
                  <input
                    type="text"
                    value={leetcodeUser}
                    onChange={(e) => setLeetcodeUser(e.target.value)}
                    placeholder="e.g. neal_wu or your username"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Public username only. DevWidgets never asks for or stores passwords.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setLeetcodeUser('');
                      updateSettings({ leetcodeUsername: '' });
                    }}
                    className="text-xs text-red-400 hover:underline"
                  >
                    Disconnect Account
                  </button>

                  <button
                    onClick={handleSaveAccounts}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Save LeetCode Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* WIDGETS TAB */}
          {activeTab === 'widgets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white">Active Desktop Widgets</h3>
                  <p className="text-[11px] text-slate-400">Toggle visibility or add more widgets</p>
                </div>

                <button
                  onClick={() => widgetActions.resetLayout()}
                  className="px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/10 text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Default Layout
                </button>
              </div>

              {/* Widgets List */}
              <div className="space-y-2">
                {widgets.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{w.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Size: {w.width}x{w.height}px · Position: ({w.x}, {w.y})
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => widgetActions.toggleVisibility(w.id)}
                        className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                          w.visible
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {w.visible ? 'Visible' : 'Hidden'}
                      </button>

                      <button
                        onClick={() => widgetActions.removeWidget(w.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                        title="Delete Widget"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Widgets Bar */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-300 mb-2">Add New Widget</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => widgetActions.addWidget('github')}
                    className="p-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-emerald-400" /> GitHub
                    </div>
                    <div className="text-[10px] text-slate-400">Activity & Heatmap</div>
                  </button>

                  <button
                    onClick={() => widgetActions.addWidget('leetcode')}
                    className="p-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-emerald-400" /> LeetCode
                    </div>
                    <div className="text-[10px] text-slate-400">Progress & Matrix</div>
                  </button>

                  <button
                    onClick={() => widgetActions.addWidget('combined')}
                    className="p-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Combined
                    </div>
                    <div className="text-[10px] text-slate-400">Dual Dashboard</div>
                  </button>

                  <button
                    onClick={() => widgetActions.addWidget('daily')}
                    className="p-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-white">Today's Progress</div>
                    <div className="text-[10px] text-slate-400">Compact Daily Check</div>
                  </button>

                  <button
                    onClick={() => widgetActions.addWidget('goal')}
                    className="p-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-white">Target Goals</div>
                    <div className="text-[10px] text-slate-400">Monthly / Weekly Targets</div>
                  </button>

                  <button
                    onClick={() => widgetActions.addWidget('quickStats')}
                    className="p-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-xl text-left text-xs transition-colors"
                  >
                    <div className="font-bold text-white">Quick Stats</div>
                    <div className="text-[10px] text-slate-400">Streak & Totals</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DESKTOP & WALLPAPER TAB */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Windows Wallpaper Background
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'bloom-dark', name: 'Windows 11 Bloom (Dark)', desc: 'Official dark aesthetic' },
                    { id: 'bloom-light', name: 'Windows 11 Bloom (Light)', desc: 'Light contrast test' },
                    { id: 'cyberpunk', name: 'Developer Dark Grid', desc: 'Minimal charcoal coding wallpaper' },
                    { id: 'dusk', name: 'Mountain Dusk', desc: 'Atmospheric gradient scenery' },
                  ].map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => updateSettings({ desktopWallpaper: wp.id })}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        settings.desktopWallpaper === wp.id
                          ? 'border-emerald-400 bg-emerald-500/10 text-white'
                          : 'border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{wp.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{wp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Show Windows 11 Taskbar
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Display bottom taskbar with Start button, clock, and system tray
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showTaskbar}
                    onChange={(e) => updateSettings({ showTaskbar: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>

                <div className="h-px bg-white/5" />

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      Show Desktop Icons
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Render Windows desktop shortcuts (Recycle Bin, Terminal, VS Code)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showDesktopIcons}
                    onChange={(e) => updateSettings({ showDesktopIcons: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            DevWidgets v1.0.0 · Designed for Windows 10 & 11
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
