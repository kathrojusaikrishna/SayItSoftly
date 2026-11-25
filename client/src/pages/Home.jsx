import { Link } from "react-router-dom";
import { ArrowUpRight, Heart } from "lucide-react";
import OrbPair from "../components/OrbPair";

export default function Home() {
  return (
    <main className="panel home-panel">
      <OrbPair />
      <div className="eyebrow">For the words that matter</div>
      <h1>Say it softly.</h1>
      <p>Write the thing you find hard to say out loud. It becomes a slow, scrolling card for someone you love, locked with a secret code only you decide to share.</p>
      <p className="muted">A small space for the words that deserve to be felt, not rushed.</p>
      <div className="actions">
        <Link className="button button-primary" to="/create">Create a card <ArrowUpRight size={16} /></Link>
        <Link className="button" to="/open">Open a card</Link>
      </div>
      <div className="home-foot"><Heart size={13} /> made for the moments that stay</div>
    </main>
  );
}