import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../utils/api";
import { decryptCard } from "../utils/crypto";

export default function OpenCard() {
  const navigate = useNavigate();
  const { cardId = "" } = useParams();
  const [id, setId] = useState(cardId);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const payload = await api(`/cards/${encodeURIComponent(id.trim().toLowerCase())}`);
      const card = await decryptCard(payload, code);
      navigate(`/card/${id.trim().toLowerCase()}`, { state: { card, code }, replace: true });
    } catch {
      setError("That secret code may be incorrect, or the card couldn't be reached. Check the ID and try again.");
    } finally { setBusy(false); }
  }

  return (
    <main className="panel form-panel">
      <div className="eyebrow">A message is waiting</div>
      <h2>Open a card.</h2>
      <p className="muted">Someone who loves you sent you a card ID and a secret code.</p>
      <form onSubmit={submit}>
        <label className="field"><span>Card ID</span><input required autoCapitalize="none" autoComplete="off" value={id} onChange={e => setId(e.target.value)} placeholder="Enter your card ID" /></label>
        <label className="field"><span>Secret code</span><input required type="password" autoComplete="off" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter the secret code" /></label>
        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="actions"><button className="button button-primary" disabled={busy}>{busy ? "Opening gently…" : "Open gently"}</button><button type="button" className="button" onClick={() => navigate("/")}>Back</button></div>
      </form>
    </main>
  );
}