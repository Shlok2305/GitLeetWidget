import { useState, useEffect } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';
import { loadSettingsFromStorage, saveSettingsToStorage } from '../utils/storage';
import { setAlwaysOnTop } from '../services/tauri/tauriBridge';

let currentSettings: AppSettings = loadSettingsFromStorage();
const listeners = new Set<(settings: AppSettings) => void>();

function notify() {
  saveSettingsToStorage(currentSettings);
  listeners.forEach((listener) => listener(currentSettings));
}

export function getSettings(): AppSettings {
  return currentSettings;
}

export function updateSettings(partial: Partial<AppSettings>): void {
  currentSettings = {
    ...currentSettings,
    ...partial,
    goals: {
      ...currentSettings.goals,
      ...(partial.goals || {}),
    },
  };
  if (partial.alwaysOnTop !== undefined) {
    setAlwaysOnTop(partial.alwaysOnTop);
  }
  notify();
}

export function resetSettings(): void {
  currentSettings = { ...DEFAULT_SETTINGS };
  notify();
}

export function useSettings(): [AppSettings, (partial: Partial<AppSettings>) => void] {
  const [settings, setLocalSettings] = useState<AppSettings>(currentSettings);

  useEffect(() => {
    const handleUpdate = (updated: AppSettings) => {
      setLocalSettings({ ...updated });
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return [settings, updateSettings];
}
