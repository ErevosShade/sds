import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar      from "./components/layout/Navbar";
import MouseFollower from "./components/ui/MouseFollower";
import ScrollToTop from "./components/ScrollToTop";

// Lazy-load all pages for code splitting
const Home       = lazy(() => import("./pages/Home"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const TeamPage   = lazy(() => import("./pages/TeamPage"));
const AboutPage  = lazy(() => import("./pages/AboutPage"));
const ChaosPage  = lazy(() => import("./pages/ChaosPage"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));

// Minimal full-screen loader so lazy pages don't flash blank
function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh", background: "#050510",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid rgba(26,111,232,0.15)",
        borderTopColor: "#1A6FE8",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// Page transition variants — subtle fade + slight upward slide
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0,  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
};

// Inner component so useLocation works inside BrowserRouter
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: "100%", minHeight: "100vh" }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/"        element={<Home />}        />
            <Route path="/events"  element={<EventsPage />}  />
            <Route path="/team"    element={<TeamPage />}    />
            <Route path="/about"   element={<AboutPage />}   />
            <Route path="/tools"   element={<ChaosPage />}   />
            <Route path="/roadmap" element={<RoadmapPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MouseFollower />

      {/* Navbar lives here — OUTSIDE AnimatePresence so it NEVER remounts on navigation */}
      <Navbar />

      <AnimatedRoutes />
    </BrowserRouter>
  );
}
