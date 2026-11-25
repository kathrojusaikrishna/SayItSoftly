import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music2, UploadCloud } from "lucide-react";
import { encryptCard, createCardId } from "../utils/crypto";
import { api } from "../utils/api";

const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

export default function CreateCard() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [form, setForm] = useState({ opening: "", body: "", big: "", closing: "", from: "", code: "" });
  const [audio, setAudio] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (key) => (event) => setForm(old => ({ ...old, [key]: event.target.value }));

  function chooseAudio(file) {
    setError("");
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".mp3") && file.type !== "audio/mpeg") {
      setError("Please choose an MP3 audio file.");
      return;
    }
    if (file.size > MAX_AUDIO_BYTES) {
      setError("Please keep the MP3 under 8 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAudio({ name: file.name, type: "audio/mpeg", dataUrl: reader.result });
    reader.onerror = () => setError("Couldn't read that audio file. Please try again.");
    reader.readAsDataURL(file);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (form.code.length < 8) {
      setError("Choose a secret code with at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const card = {
        opening: form.opening.trim(),
        body: form.body.trim(),
        big: form.big.trim(),
        closing: form.closing.trim(),
        from: form.from.trim(),
        audio
      };
      const id = createCardId();
      const encrypted = await encryptCard(card, form.code);
      await api(`/cards/${id}`, { method: "POST", body: JSON.stringify(encrypted) });
      navigate(`/saved/${id}`, { state: { card, code: form.code } });
    } catch (err) {
      setError(err.message || "Couldn't save your card. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="panel form-panel">
      <div className="eyebrow">Take your time</div>
      <h2>Write your card.</h2>
      <form onSubmit={submit}>
        <label className="field"><span>Opening line</span><small>The first thing they see.</small>
          <input required maxLength={120} value={form.opening} onChange={update("opening")} placeholder="There is something I want you to know…" /></label>
        <label className="field"><span>Your message</span><small>Each blank line becomes a new moment.</small>
          <textarea required maxLength={3500} value={form.body} onChange={update("body")} placeholder="Start wherever your heart wants to…" /></label>
        <label className="field"><span>The big line</span><small>The one sentence you most want to say.</small>
          <input required maxLength={100} value={form.big} onChange={update("big")} placeholder="You mean more to me than words can say." /></label>
        <label className="field"><span>Closing line</span>
          <input required maxLength={200} value={form.closing} onChange={update("closing")} placeholder="Until the next time…" /></label>
        <label className="field"><span>Signed (optional)</span>
          <input maxLength={60} value={form.from} onChange={update("from")} placeholder="Your name" /></label>

        <div className="upload-block">
          <div className="upload-heading"><Music2 size={19} /><div><strong>Add your song</strong><small>The recipient will hear this while reading your card.</small></div></div>
          <input ref={fileRef} type="file" accept=".mp3,audio/mpeg" hidden onChange={e => chooseAudio(e.target.files?.[0])} />
          <button className="upload-button" type="button" onClick={() => fileRef.current?.click()}>
            <UploadCloud size={18} /> {audio ? "Choose a different MP3" : "Upload an MP3"}
          </button>
          {audio && <p className="file-selected">♪ {audio.name} <button type="button" onClick={() => { setAudio(null); if (fileRef.current) fileRef.current.value = ""; }}>Remove</button></p>}
          <small className="upload-note">MP3 only · Maximum 8 MB · Audio is encrypted with your card</small>
        </div>

        <label className="field"><span>Secret code</span><small>At least 8 characters. It is never stored. Share it separately from the card link.</small>
          <input required minLength={8} type="password" autoComplete="new-password" value={form.code} onChange={update("code")} placeholder="Choose a secret phrase" /></label>
        {error && <p className="error-text" role="alert">{error}</p>}
        <div className="actions">
          <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Locking your words…" : "Lock and save"}</button>
          <button className="button" type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </main>
  );
}