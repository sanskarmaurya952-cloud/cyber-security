export const API_BASE = "http://localhost:8000";

export async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error(`API Error [${path}]:`, e.message);
    return null;
  }
}

export function useAutoRefresh(fn, interval = 5000) {
  const { useEffect, useRef } = require("react");
  const savedFn = useRef(fn);
  useEffect(() => { savedFn.current = fn; }, [fn]);
  useEffect(() => {
    savedFn.current();
    const id = setInterval(() => savedFn.current(), interval);
    return () => clearInterval(id);
  }, [interval]);
}

export const SEVERITY_COLORS = {
  critical: "#ff2d55",
  high: "#ff6b35",
  medium: "#ffd60a",
  low: "#30d158",
  info: "#0a84ff",
};

export const SEVERITY_BG = {
  critical: "rgba(255,45,85,0.15)",
  high: "rgba(255,107,53,0.15)",
  medium: "rgba(255,214,10,0.15)",
  low: "rgba(48,209,88,0.15)",
  info: "rgba(10,132,255,0.15)",
};

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}