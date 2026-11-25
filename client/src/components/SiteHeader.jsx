import { Moon, Sun } from "lucide-react";

export default function SiteHeader({ dark, onToggle }) {
  return (
    <header className="topbar">
      <a className="wordmark" href="/">✳ <span>a little note, held close</span></a>
      <button className="icon-button" onClick={onToggle} aria-label="Toggle theme">
        {dark ? <Sun size={17} /> : <Moon size={17} />}
      </button>
    </header>
  );
}