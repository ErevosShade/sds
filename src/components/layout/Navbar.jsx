import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, ExternalLink } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import sdsLogo from "../../assets/sds-logo.jpg";

// ─── Config ──────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home",     type: "route",  to: "/"        },
  { label: "About",    type: "scroll", to: "#about"   },
  { label: "Events",   type: "scroll", to: "#events"  },
  { label: "Team",     type: "scroll", to: "#team"    },
];

const SCROLL_THRESHOLD = 24; // px before navbar solidifies

// ─── Drawer animation variants ───────────────────────────────────────────────
const drawerVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

const drawerItemVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scrollToSection(hash) {
  const id = hash.replace("#", "");
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
      <div
        className="rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 group-hover:scale-105"
        style={{
          width: 38,
          height: 38,
          background: "#0D0D1A",
          border: "1px solid rgba(26,111,232,0.30)",
          padding: "5px",
          boxShadow: "0 0 12px rgba(26,111,232,0.15)",
        }}
      >
        <img
          src={sdsLogo}
          alt="SDS BIT Mesra logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="font-bold text-sm tracking-wide transition-colors duration-200"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: "#F0F0F0",
            lineHeight: 1.1,
          }}
        >
          SDS
        </span>
        <span
          className="text-xs font-medium"
          style={{
            color: "#606080",
            letterSpacing: "0.05em",
            lineHeight: 1.2,
          }}
        >
          BIT Mesra
        </span>
      </div>
    </Link>
  );
}

function DesktopNavLink({ link, activeSection, isToolsPage }) {
  const location = useLocation();

  const isActive =
    link.type === "route"
      ? link.to === "/"
        ? location.pathname === "/" && activeSection === "hero"
        : location.pathname === link.to
      : activeSection === link.to.replace("#", "");

  const handleClick = (e) => {
    if (link.type === "scroll") {
      e.preventDefault();
      scrollToSection(link.to);
    }
  };

  return (
    <Link
      to={link.type === "route" ? link.to : location.pathname}
      onClick={handleClick}
      className="relative flex flex-col items-center gap-0.5 py-1 group"
      style={{ textDecoration: "none" }}
    >
      <span
        className="text-sm font-medium transition-colors duration-200"
        style={{ color: isActive ? "#F0F0F0" : "#808098" }}
        onMouseEnter={(e) => (e.target.style.color = "#F0F0F0")}
        onMouseLeave={(e) =>
          (e.target.style.color = isActive ? "#F0F0F0" : "#808098")
        }
      >
        {link.label}
      </span>
      {/* Active underline */}
      <span
        className="absolute -bottom-1 left-0 right-0 h-px rounded-full transition-all duration-300"
        style={{
          background: "linear-gradient(90deg, #F5A623, #FFBE5C)",
          transform: isActive ? "scaleX(1)" : "scaleX(0)",
          opacity: isActive ? 1 : 0,
          boxShadow: isActive ? "0 0 8px #F5A62360" : "none",
        }}
      />
    </Link>
  );
}

function AiToolsButton() {
  return (
    <Link
      to="/tools"
      className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(26,111,232,0.12)",
        border: "1px solid rgba(26,111,232,0.30)",
        color: "#4D91F0",
        boxShadow: "0 0 16px rgba(26,111,232,0.10)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(26,111,232,0.22)";
        e.currentTarget.style.borderColor = "rgba(26,111,232,0.55)";
        e.currentTarget.style.boxShadow = "0 0 24px rgba(26,111,232,0.25)";
        e.currentTarget.style.color = "#7DB5F8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(26,111,232,0.12)";
        e.currentTarget.style.borderColor = "rgba(26,111,232,0.30)";
        e.currentTarget.style.boxShadow = "0 0 16px rgba(26,111,232,0.10)";
        e.currentTarget.style.color = "#4D91F0";
      }}
    >
      <Sparkles size={13} strokeWidth={2} />
      AI Tools
    </Link>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled]           = useState(false);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const location = useLocation();

  // ── Scroll watcher: solidify navbar + track active section ──────────────
  useEffect(() => {
    const SECTIONS = ["team", "events", "what-we-do", "stats", "about", "hero"];

    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);

      // Find which section is currently in view
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom > 100) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile drawer on route change ─────────────────────────────────
  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  // ── Lock body scroll when drawer is open ────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleMobileNavClick = useCallback((link) => {
    setMobileOpen(false);
    if (link.type === "scroll") {
      // Small timeout lets drawer close first
      setTimeout(() => scrollToSection(link.to), 200);
    }
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(5,5,16,0.88)"
            : "rgba(5,5,16,0.0)",
          backdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(18px) saturate(1.4)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(26,111,232,0.12)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 32px rgba(0,0,0,0.5)"
            : "none",
        }}
      >
        <nav
          className="flex items-center justify-between"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0.85rem 1.5rem" }}
        >
          {/* Logo */}
          <Logo />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <DesktopNavLink
                key={link.label}
                link={link}
                activeSection={activeSection}
              />
            ))}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <AiToolsButton />
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
            style={{
              background: mobileOpen
                ? "rgba(26,111,232,0.15)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#A0A0B8",
            }}
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X size={18} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu size={18} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* ── Mobile drawer ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden overflow-hidden"
              style={{
                background: "rgba(5,5,16,0.97)",
                borderTop: "1px solid rgba(26,111,232,0.10)",
                borderBottom: "1px solid rgba(26,111,232,0.10)",
              }}
            >
              <div className="flex flex-col" style={{ padding: "1rem 1.5rem 1.5rem" }}>

                {/* Nav links */}
                {NAV_LINKS.map((link, i) => {
                  const isActive =
                    link.type === "scroll"
                      ? activeSection === link.to.replace("#", "")
                      : activeSection === "hero" && link.to === "/";

                  return (
                    <motion.div
                      key={link.label}
                      custom={i}
                      variants={drawerItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link
                        to={link.type === "route" ? link.to : location.pathname}
                        onClick={() => handleMobileNavClick(link)}
                        className="flex items-center justify-between py-3.5 group"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                          textDecoration: "none",
                        }}
                      >
                        <span
                          className="text-base font-medium transition-colors duration-150"
                          style={{
                            fontFamily: "'DM Sans', sans-serif",
                            color: isActive ? "#F0F0F0" : "#808098",
                          }}
                        >
                          {link.label}
                        </span>
                        {isActive && (
                          <span
                            className="w-5 h-px rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #F5A623, #FFBE5C)",
                              boxShadow: "0 0 6px #F5A62350",
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* AI Tools CTA in drawer */}
                <motion.div
                  custom={NAV_LINKS.length}
                  variants={drawerItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="pt-4"
                >
                  <Link
                    to="/tools"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      background: "rgba(26,111,232,0.14)",
                      border: "1px solid rgba(26,111,232,0.32)",
                      color: "#4D91F0",
                    }}
                  >
                    <Sparkles size={14} strokeWidth={2} />
                    Explore AI Tools
                    <ExternalLink size={12} style={{ opacity: 0.6 }} />
                  </Link>
                </motion.div>

                {/* Social / meta row */}
                <motion.div
                  custom={NAV_LINKS.length + 1}
                  variants={drawerItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center justify-center gap-1 pt-5"
                >
                  <span
                    className="text-xs"
                    style={{ color: "#3A3A5A", fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Society for Data Science • BIT Mesra
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Spacer so content doesn't sit under fixed navbar ────────────── */}
      {/* Only needed if your first section isn't full-viewport (Hero already handles it) */}
    </>
  );
}
