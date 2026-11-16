import { createContext, useContext } from 'react';

/** Footer "Pause animations" toggle, remembered per browser. */
export const MotionPrefsContext = createContext({ paused: false, setPaused: () => {} });
export const useMotionPrefs = () => useContext(MotionPrefsContext);

export const MOTION_PAUSED_KEY = 'apv-motion-paused';

export function readMotionPaused() {
  try {
    return localStorage.getItem(MOTION_PAUSED_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveMotionPaused(paused) {
  try {
    localStorage.setItem(MOTION_PAUSED_KEY, paused ? '1' : '0');
  } catch {
    /* storage blocked */
  }
}

/** True when animations should jump instead of play (footer toggle or OS setting). */
export const motionIsCalm = () =>
  document.documentElement.classList.contains('apv-motion-paused') || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
