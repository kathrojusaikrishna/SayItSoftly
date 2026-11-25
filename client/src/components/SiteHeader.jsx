import { Moon, Sun } from "lucide-react";

export default function SiteHeader({ dark, onToggle }) {
  return (
    <header className="topbar">
      <a className="wordmark" href="/" aria-label="Say It Softly home">
        <img src="/logo.png" alt="Say It Softly" />
      </a>

      <button
        className="icon-button"
        onClick={onToggle}
        aria-label="Toggle theme"
      >
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </header>
  );
}
