import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { decryptCard } from "../utils/crypto";
import { api } from "../utils/api";
import StoryBeat from "../components/StoryBeat";
import MusicPlayer from "../components/MusicPlayer";

export default function Story() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [card, setCard] = useState(state?.card || null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(!state?.card);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (state?.card) return;
    // A story URL alone cannot decrypt the card; ask for the secret code.
    navigate(`/open/${id}`, { replace: true });
  }, [id, state, navigate]);

  if (loading || !card)
    return (
      <main className="panel">
        <p>{error || "Opening your story…"}</p>
      </main>
    );

  const paragraphs = (card.body || "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="story-page">
      <StoryBeat big>
        <p>{card.opening}</p>
        <p className="scroll-hint">Scroll slowly.</p>
      </StoryBeat>
      {paragraphs.map((paragraph, index) => (
        <StoryBeat key={index}>
          <p>{paragraph}</p>
        </StoryBeat>
      ))}
      <StoryBeat big>
        <p>{card.big}</p>
      </StoryBeat>
      <StoryBeat last>
        <div className="ending">
          {!joined ? (
            <button className="button" onClick={() => setJoined(true)}>
              Bring us closer
            </button>
          ) : (
            <>
              <p className="closing-line">{card.closing}</p>
              {card.from && <p className="signature">— {card.from}</p>}
              <div className="actions centered">
                <button
                  className="button"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setJoined(false);
                  }}
                >
                  Read again
                </button>
                <button className="button" onClick={() => navigate("/")}>
                  Make a card of your own
                </button>
              </div>
            </>
          )}
        </div>
      </StoryBeat>
      {card.audio && <MusicPlayer audioData={card.audio} />}
      <div className={`story-sky ${joined ? "joined" : ""}`} aria-hidden="true">
        <div className="thread" />
        <div className="bloom" />
        <i className="orb orb-left" />
        <i className="orb orb-right" />
      </div>
      <div className="story-fade" />
    </div>
  );
}
