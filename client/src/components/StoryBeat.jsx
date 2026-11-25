import { useEffect, useRef, useState } from "react";

export default function StoryBeat({ children, big = false, last = false, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.55 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={`beat ${big ? "beat-big" : ""} ${last ? "beat-last" : ""} ${className}`}>
      <div ref={ref} className={`beat-inner ${visible ? "is-visible" : ""}`}>{children}</div>
    </section>
  );
}