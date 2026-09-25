/**
 * Tauri desktop bridge
 * Provides native Windows window actions if running in Tauri,
 * with seamless no-op / simulated behaviors in browser dev mode.
 */

export const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

export async function setAlwaysOnTop(alwaysOnTop: boolean): Promise<void> {
  if (isTauri) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().setAlwaysOnTop(alwaysOnTop);
    } catch (e) {
      console.warn('Tauri setAlwaysOnTop error:', e);
    }
  }
}

export async function minimizeWindow(): Promise<void> {
  if (isTauri) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().minimize();
    } catch (e) {
      console.warn('Tauri minimize error:', e);
    }
  }
}

export async function closeWindow(): Promise<void> {
  if (isTauri) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().close();
    } catch (e) {
      console.warn('Tauri close error:', e);
    }
  }
}

export async function startNativeDragging(): Promise<void> {
  if (isTauri) {
    try {
      const { getCurrentWindow } = await import('@tauri-apps/api/window');
      await getCurrentWindow().startDragging();
    } catch (e) {
      console.warn('Tauri startDragging error:', e);
    }
  }
}
