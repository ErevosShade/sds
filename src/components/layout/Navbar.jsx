import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import sdsLogo from "../../assets/sds-logo.jpg";

const NAV_LINKS = [
  { label: "Home",   type: "route",  to: "/" },
  { label: "About",  type: "scroll", to: "#about" },
  { label: "Events", type: "scroll", to: "#events" },
  { label: "Team",   type: "scroll", to: "#team" },
];

const SCROLL_THRESHOLD = 80;

function scrollToSection(hash) {
  const el = document.getElementById(hash.replace("#", ""));
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Navbar() {
  const [scrolled,       setScrolled]       = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("hero");
  const location = useLocation();

  useEffect(() => {
    const SECTIONS = ["team", "events", "what-we-do", "about", "hero"];
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top, bottom } = el.getBoundingClientRect();
        if (top <= 120 && bottom > 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = useCallback((link, e) => {
    if (link.type === "scroll") {
      e?.preventDefault();
      scrollToSection(link.to);
    }
    setMobileOpen(false);
  }, []);

  const isActive = (link) =>
    link.type === "scroll"
      ? activeSection === link.to.replace("#", "")
      : activeSection === "hero" && link.to === "/";

  return (
    <>
      {/* ── Outer header: always full-width fixed, transparent ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ pointerEvents: "none" }}
      >
        {/* Outer centering shell — always full width, just provides padding */}
        <motion.div
          className="w-full flex justify-center"
          animate={scrolled ? { paddingLeft: "24px", paddingRight: "24px", paddingTop: "12px", paddingBottom: "0px" } : { paddingLeft: "0px", paddingRight: "0px", paddingTop: "0px", paddingBottom: "0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* ── Inner pill — morphs from full-width strip to floating pill ── */}
          <motion.nav
            animate={scrolled ? "scrolled" : "top"}
            variants={{
              top: {
                maxWidth: "1400px",
                borderRadius: 0,
                background: "rgba(5,5,16,0)",
                backdropFilter: "blur(0px)",
                WebkitBackdropFilter: "blur(0px)",
                borderColor: "rgba(255,255,255,0)",
                boxShadow: "0 0 0 rgba(0,0,0,0)",
                paddingTop: "1.1rem",
                paddingBottom: "1.1rem",
                paddingLeft: "2rem",
                paddingRight: "2rem",
              },
              scrolled: {
                maxWidth: "860px",
                borderRadius: 9999,
                background: "rgba(8,8,22,0.85)",
                backdropFilter: "blur(20px) saturate(1.5)",
                WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                borderColor: "rgba(26,111,232,0.20)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(26,111,232,0.06) inset",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                paddingLeft: "1.25rem",
                paddingRight: "1.25rem",
              },
            }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between w-full"
            style={{
              pointerEvents: "auto",
              border: "1px solid",
              willChange: "max-width, border-radius, background",
            }}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <motion.div
                animate={scrolled ? { width: 32, height: 32, padding: "4px" } : { width: 40, height: 40, padding: "5px" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl overflow-hidden flex-shrink-0"
                style={{
                  background: "#0D0D1A",
                  border: "1px solid rgba(26,111,232,0.28)",
                  boxShadow: "0 0 12px rgba(26,111,232,0.12)",
                }}
              >
                <img src={sdsLogo} alt="SDS" className="w-full h-full object-contain" />
              </motion.div>
              <AnimatePresence>
                {!scrolled && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col leading-tight overflow-hidden"
                  >
                    <span style={{ fontFamily: "'Syne',sans-serif", color: "#F0F0F0", fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.1 }}>SDS</span>
                    <span style={{ color: "#606080", fontSize: "0.7rem", letterSpacing: "0.05em" }}>BIT Mesra</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link);
                return (
                  <Link
                    key={link.label}
                    to={link.type === "route" ? link.to : location.pathname}
                    onClick={(e) => handleNavClick(link, e)}
                    style={{ textDecoration: "none" }}
                  >
                    <motion.div
                      animate={
                        active
                          ? {
                              background: scrolled
                                ? "rgba(26,111,232,0.18)"
                                : "rgba(26,111,232,0.10)",
                              color: "#F0F0F0",
                            }
                          : { background: "rgba(255,255,255,0)", color: "#808098" }
                      }
                      whileHover={{ color: "#F0F0F0", background: "rgba(255,255,255,0.05)" }}
                      transition={{ duration: 0.2 }}
                      className="relative flex items-center gap-1 text-sm font-medium rounded-full cursor-pointer"
                      style={{ padding: scrolled ? "0.35rem 0.9rem" : "0.4rem 0.85rem" }}
                    >
                      {link.label}
                      {/* Orange underline dot for active — only when NOT scrolled */}
                      {active && !scrolled && (
                        <motion.span
                          layoutId="active-dot"
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                          style={{ background: "#F5A623", boxShadow: "0 0 6px #F5A623" }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* AI Tools pill button */}
            <div className="hidden md:flex items-center">
              <Link to="/tools">
                <motion.div
                  animate={
                    scrolled
                      ? { background: "rgba(26,111,232,0.20)", paddingLeft: "0.9rem", paddingRight: "0.9rem", paddingTop: "0.4rem", paddingBottom: "0.4rem" }
                      : { background: "rgba(26,111,232,0.12)", paddingLeft: "1rem", paddingRight: "1rem", paddingTop: "0.5rem", paddingBottom: "0.5rem" }
                  }
                  whileHover={{ background: "rgba(26,111,232,0.32)", scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 rounded-full font-semibold cursor-pointer"
                  style={{ border: "1px solid rgba(26,111,232,0.35)", color: "#4D91F0", fontSize: "0.85rem", boxShadow: "0 0 16px rgba(26,111,232,0.15)" }}
                >
                  <Sparkles size={13} strokeWidth={2} />
                  AI Tools
                </motion.div>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
              style={{
                background: mobileOpen ? "rgba(26,111,232,0.18)" : "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#A0A0B8",
                pointerEvents: "auto",
              }}
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X size={16} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.nav>
        </motion.div>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mx-4 mt-2 rounded-2xl overflow-hidden"
              style={{
                background: "rgba(8,8,22,0.96)",
                border: "1px solid rgba(26,111,232,0.15)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                pointerEvents: "auto",
              }}
            >
              <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                {NAV_LINKS.map((link, i) => {
                  const active = isActive(link);
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055, duration: 0.28, ease: [0.22,1,0.36,1] }}
                    >
                      <Link
                        to={link.type === "route" ? link.to : location.pathname}
                        onClick={(e) => handleNavClick(link, e)}
                        className="flex items-center justify-between py-3"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", textDecoration: "none" }}
                      >
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 500, color: active ? "#F0F0F0" : "#808098" }}>
                          {link.label}
                        </span>
                        {active && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5A623", boxShadow: "0 0 8px #F5A623" }} />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.055, duration: 0.28 }}
                  className="pt-3"
                >
                  <Link
                    to="/tools"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-semibold text-sm"
                    style={{ background: "rgba(26,111,232,0.15)", border: "1px solid rgba(26,111,232,0.30)", color: "#4D91F0" }}
                  >
                    <Sparkles size={13} />
                    Explore AI Tools
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}