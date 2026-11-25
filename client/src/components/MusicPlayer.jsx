import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX, Music2 } from "lucide-react";

export default function MusicPlayer({ audioData }) {
  const audioRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [needsTap, setNeedsTap] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Set volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Attempt autoplay when the card opens
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !audioData?.dataUrl) return;

    let cancelled = false;

    async function startMusic() {
      try {
        await audio.play();

        if (!cancelled) {
          setPlaying(true);
          setNeedsTap(false);
        }
      } catch {
        if (!cancelled) {
          setPlaying(false);
          setNeedsTap(true);
        }
      }
    }

    startMusic();

    return () => {
      cancelled = true;
      audio.pause();
    };
  }, [audioData?.dataUrl]);

  // Play / pause
  async function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
        setNeedsTap(false);
      } catch {
        setNeedsTap(true);
      }
    }
  }

  if (!audioData?.dataUrl) return null;

  return (
    <div className="floating-music">
      <audio
        ref={audioRef}
        src={audioData.dataUrl}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {showSettings && (
        <div className="music-settings">
          <strong>{audioData.name || "Your personal soundtrack"}</strong>

          <span>{playing ? "Playing your song ♡" : "Music paused"}</span>

          <div className="music-volume">
            <button onClick={() => setMuted(!muted)} aria-label="Toggle mute">
              {muted ? <VolumeX /> : <Volume2 />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                setMuted(false);
              }}
            />
          </div>
        </div>
      )}

      <button
        className="music-toggle"
        onClick={toggleMusic}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}

        <span>
          {playing ? "Music on" : needsTap ? "Play song" : "Music off"}
        </span>
      </button>

      <button
        className="music-settings-toggle"
        onClick={() => setShowSettings(!showSettings)}
        aria-label="Music settings"
      >
        <Music2 size={17} />
      </button>
    </div>
  );
}
