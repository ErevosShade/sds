import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home        from "./pages/Home";
import EventsPage  from "./pages/EventsPage";
import TeamPage    from "./pages/TeamPage";
import AboutPage   from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />}       />
        <Route path="/events"  element={<EventsPage />} />
        <Route path="/team"    element={<TeamPage />}   />
        <Route path="/about"   element={<AboutPage />}  />
      </Routes>
    </BrowserRouter>
  );
}