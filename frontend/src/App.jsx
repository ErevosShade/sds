import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home        from "./pages/Home";
import EventsPage  from "./pages/EventsPage";
import TeamPage    from "./pages/TeamPage";
import AboutPage   from "./pages/AboutPage";
import MouseFollower from "./components/ui/MouseFollower"; 
import ScrollToTop from "./components/ScrollToTop"; 
import ChaosPage from "./pages/ChaosPage";
import RoadmapPage from "./pages/RoadmapPage";
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MouseFollower />  {/* Add the MouseFollower component here */}
      <Routes>
        <Route path="/"        element={<Home />}       />
        <Route path="/events"  element={<EventsPage />} />
        <Route path="/team"    element={<TeamPage />}   />
        <Route path="/about"   element={<AboutPage />}  />
        <Route path="/tools"   element={<ChaosPage />}  />
        <Route path="/roadmap" element={<RoadmapPage />} />
      </Routes>
    </BrowserRouter>
  );
}