import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Copy, Eye, MessageCircle, Check, Heart } from "lucide-react";

export default function SavedCard() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState("");

  // Card link
  const link = `${window.location.origin}/open/${id}`;

  // Secret code from card creation
  const secretCode = state?.code;

  // WhatsApp message
  const shareMessage = `A little note, made just for you.

No expectations, no rush. Just something I'd like you to read. 🤍

${link}

 Your secret code: ${secretCode}`;

  // Copy card link
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert("Unable to copy the link.");
    }
  }

  // Share through WhatsApp
  function shareOnWhatsApp() {
    if (!secretCode) {
      alert("Secret code is unavailable.");
      return;
    }

    const number = phone.replace(/\D/g, "");

    if (!number || number.length < 10) {
      alert("Please enter a valid WhatsApp number.");
      return;
    }

    const whatsappURL = `https://wa.me/${number}?text=${encodeURIComponent(
      shareMessage,
    )}`;

    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="panel saved-card">
      <div className="eyebrow">A little something, safely kept</div>

      <div className="success-heart">
        <Heart size={30} />
      </div>

      <h2>Your card is locked.</h2>

      <p>Your heartfelt message is ready. Share it with someone special.</p>

      {/* Card ID */}
      <div className="idbox">{id}</div>

      {/* Share link */}
      <div className="share-details">
        <p className="muted">
          <strong>Card link</strong>
        </p>

        <div className="share-link">
          <span>{link}</span>

          <button className="copy-icon" onClick={copyLink} title="Copy link">
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        {/* Secret code */}
        <p className="muted secret-display">
          <strong>Your secret code</strong>
        </p>

        <div className="secret-box">{secretCode || "Unavailable"}</div>

        <small className="security-note">
          Share the code with the recipient. It is never stored in MongoDB.
        </small>
      </div>

      {/* Personalized music */}
      {state?.card?.audio && (
        <p className="music-note">♫ Your personal soundtrack is included!</p>
      )}

      {/* Action buttons */}
      <div className="actions">
        <div className="phone-input-section">
          <label htmlFor="recipient-phone">
            Recipient's WhatsApp number ❤️
          </label>

          <input
            id="recipient-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="91 98765 43210"
          />

          <small>Include the country code.</small>
        </div>
        <button
          className="button button-primary whatsapp-button"
          onClick={shareOnWhatsApp}
        >
          <MessageCircle size={18} />
          Share on WhatsApp
        </button>

        <button
          className="button"
          onClick={() => navigate(`/card/${id}`, { state })}
        >
          <Eye size={17} />
          Preview card
        </button>

        <button className="button" onClick={() => navigate("/")}>
          Done
        </button>
      </div>

      <p className="whatsapp-hint">
        Your message will open in WhatsApp. Choose the recipient and press Send.
      </p>
    </main>
  );
}
