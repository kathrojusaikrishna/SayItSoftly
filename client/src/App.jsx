import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SiteHeader from "./components/SiteHeader";
import Home from "./pages/Home";
import CreateCard from "./pages/CreateCard";
import OpenCard from "./pages/OpenCard";
import SavedCard from "./pages/SavedCard";
import Story from "./pages/Story";

export default function App() {
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const isStory = location.pathname.startsWith("/card/");
  useEffect(() => { document.body.classList.toggle("dark", dark); }, [dark]);
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <>
      {!isStory && <div className="app-shell"><SiteHeader dark={dark} onToggle={() => setDark(v => !v)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCard />} />
          <Route path="/open" element={<OpenCard />} />
          <Route path="/open/:cardId" element={<OpenCard />} />
          <Route path="/saved/:id" element={<SavedCard />} />
          <Route path="/card/:id" element={<Story />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="site-footer">Made with a little courage and a lot of love.</footer>
      </div>}
      {isStory && <Routes><Route path="/card/:id" element={<Story />} /></Routes>}
    </>
  );
}