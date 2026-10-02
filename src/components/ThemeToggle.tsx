"use client";
import { useSyncExternalStore } from "react";
import Icon from "./Icon";

/** The theme lives on <html data-theme>; read it as an external store so SSR and hydration agree. */
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
};
const isInk = () => document.documentElement.dataset.theme === "ink";

export default function ThemeToggle() {
  const ink = useSyncExternalStore(subscribe, isInk, () => false);
  const flip = () => {
    const root = document.documentElement;
    if (ink) delete root.dataset.theme;
    else root.dataset.theme = "ink";
    try {
      localStorage.setItem("theme", ink ? "paper" : "ink");
    } catch {}
  };
  return (
    <button className="theme-btn" onClick={flip} aria-pressed={ink} aria-label={ink ? "Switch to paper" : "Switch to night ink"} title={ink ? "Paper" : "Night ink"}>
      <Icon name={ink ? "sun" : "moon"} size={17} />
    </button>
  );
}
