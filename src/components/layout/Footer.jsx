import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Briefcase, Image, ArrowUpRight, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import sdsLogo from "../../assets/sds-logo.png";

const NAV_ITEMS = [
  { index: "01", label: "home",      to: "/",        output: "→  /index"    },
  { index: "02", label: "about",     to: "/about",   output: "→  /about"    },
  { index: "03", label: "events",    to: "/events",  output: "→  /events"   },
  { index: "04", label: "team",      to: "/team",    output: "→  /team"     },
  { index: "05", label: "ai_tools",  to: "/tools",   output: "→  /tools  ✦" },
];

const SOCIALS = [
  { Icon: Code2,     href: "#", label: "GitHub"    },
  { Icon: Briefcase, href: "#", label: "LinkedIn"  },
  { Icon: Image,     href: "#", label: "Instagram" },
];

function NotebookCell() {
  const [hovered, setHovered] = useState(null);
  const [cellRun, setCellRun] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden h-full"
      style={{ background: "#080812", border: "1px solid rgba(255,255,255,0.07)" }}>

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5"
        style={{ background: "#0D0D1A", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <Terminal size={12} style={{ color: "#606080" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#606080" }}>
            sds_navigation.ipynb
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3A3A5A" }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#3A3A5A" }} />
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: cellRun ? "#22C55E" : "#F5A623", boxShadow: cellRun ? "0 0 6px #22C55E" : "0 0 6px #F5A623", cursor: "pointer" }}
            onClick={() => setCellRun(r => !r)}
            title="Run cell"
          />
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pt-3 pb-2 flex gap-3">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#3A3A5A", marginTop: 1, flexShrink: 0 }}>
          In [{cellRun ? "1" : " "}]:
        </span>
        <div className="flex flex-col gap-0.5">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.73rem" }}>
            <span style={{ color: "#F5A623" }}>import</span>
            {" "}<span style={{ color: "#F0F0F0" }}>sds</span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.73rem" }}>
            <span style={{ color: "#F5A623" }}>for</span>
            {" "}<span style={{ color: "#F0F0F0" }}>page</span>
            {" "}<span style={{ color: "#F5A623" }}>in</span>
            {" "}<span style={{ color: "#4D91F0" }}>sds</span>
            <span style={{ color: "#808098" }}>.</span>
            <span style={{ color: "#22C55E" }}>navigate</span>
            <span style={{ color: "#F0F0F0" }}>()</span>
            <span style={{ color: "#F0F0F0" }}>:</span>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.73rem", paddingLeft: "1rem" }}>
            <span style={{ color: "#4D91F0" }}>print</span>
            <span style={{ color: "#F0F0F0" }}>(page)</span>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.04)", margin: "0 1rem" }} />

      {/* Output */}
      <div className="px-4 pt-2 pb-3 flex gap-3">
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#3A3A5A", marginTop: 3, flexShrink: 0 }}>
          Out[{cellRun ? "1" : " "}]:
        </span>
        <div className="flex flex-col gap-0.5 flex-1">
          {NAV_ITEMS.map((item, i) => (
            <motion.div key={item.label}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link to={item.to} style={{ textDecoration: "none" }}>
                <motion.div
                  className="flex items-center justify-between py-1 px-2 rounded-lg"
                  animate={{ background: hovered === i ? "rgba(26,111,232,0.07)" : "transparent" }}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#3A3A5A" }}>
                      {item.index}
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem",
                      color: hovered === i ? "#4D91F0" : "#A0A0B8", transition: "color 0.15s",
                    }}>
                      {item.label}<span style={{ color: "#3A3A5A" }}>()</span>
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
                    color: hovered === i ? (item.label === "ai_tools" ? "#F5A623" : "#22C55E") : "#3A3A5A",
                    transition: "color 0.15s",
                  }}>
                    {item.output}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer style={{ background: "#050510", position: "relative", overflow: "hidden" }}>

      {/* Ghost SDS */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 900,
          fontSize: "clamp(14rem, 35vw, 32rem)",
          color: "rgba(26,111,232,0.025)",
          letterSpacing: "-0.06em", lineHeight: 1,
          userSelect: "none", whiteSpace: "nowrap",
        }}>SDS</span>
      </div>

      {/* Top divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(26,111,232,0.4) 30%, rgba(245,166,35,0.3) 70%, transparent 100%)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "5rem 1.5rem 3rem", position: "relative", zIndex: 1 }}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">

          {/* ── LEFT: Brand + socials + get involved ── */}
          <div className="flex flex-col gap-6">

            {/* Logo + name */}
            <div className="flex items-center gap-3">
              <img src={sdsLogo} alt="SDS" style={{ width: 44, height: 44, objectFit: "contain" }} />
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 900, color: "#F0F0F0", letterSpacing: "-0.01em" }}>
                  Society for Data Science
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#3A3A5A", letterSpacing: "0.12em", marginTop: 2 }}>
                  BIT MESRA · EST. 2019
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#606080", lineHeight: 1.7, maxWidth: 320 }}>
              Where students become data scientists — through workshops, research,
              hackathons, and real-world projects that matter.
            </p>

            {/* Social icons — horizontal row */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#606080" }}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(26,111,232,0.12)";
                    e.currentTarget.style.borderColor = "rgba(26,111,232,0.35)";
                    e.currentTarget.style.color = "#4D91F0";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#606080";
                  }}
                >
                  <Icon size={15} strokeWidth={1.8} />
                </motion.a>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

            {/* Join card */}
            <div className="relative rounded-2xl overflow-hidden p-5 flex flex-col gap-4"
              style={{ background: "linear-gradient(135deg, rgba(26,111,232,0.10) 0%, rgba(245,166,35,0.06) 100%)", border: "1px solid rgba(26,111,232,0.18)" }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, #1A6FE8, #F5A623)" }} />
              <div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1rem", fontWeight: 800, color: "#F0F0F0", lineHeight: 1.2 }}>
                  Ready to build with data?
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "#606080", marginTop: "0.4rem", lineHeight: 1.6 }}>
                  Join 200+ students building real projects, attending workshops, and getting placed.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <motion.a href="#"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm"
                  style={{ background: "#1A6FE8", color: "#fff", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 20px rgba(26,111,232,0.4)" }}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  Join SDS <ArrowUpRight size={13} />
                </motion.a>
                <Link to="/tools" style={{ textDecoration: "none" }}>
                  <motion.div
                    className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold"
                    style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.2)", color: "#F5A623", fontFamily: "'DM Sans', sans-serif" }}
                    whileHover={{ background: "rgba(245,166,35,0.15)" }} whileTap={{ scale: 0.97 }}>
                    AI Tools ✦
                  </motion.div>
                </Link>
              </div>
              <div aria-hidden className="absolute bottom-3 right-4 flex gap-1.5 opacity-25">
                {[0,1,2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: i === 0 ? "#1A6FE8" : i === 1 ? "#4D91F0" : "#F5A623" }}
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }} />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Notebook cell ── */}
          <div className="flex flex-col justify-between gap-4">
            <div className="mb-2">
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#3A3A5A", letterSpacing: "0.14em" }}>
                # click the green dot to run
              </span>
            </div>
            <div className="flex-1">
              <NotebookCell />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", position: "relative", zIndex: 1 }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ maxWidth: 1100, margin: "0 auto", padding: "1.25rem 1.5rem" }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#3A3A5A" }}>
            © 2025 Society for Data Science, BIT Mesra. All rights reserved.
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#2A2A4A" }}>
            built_with(<span style={{ color: "#4D91F0" }}>react</span>{" + "}<span style={{ color: "#F5A623" }}>python</span>{" + "}<span style={{ color: "#EF4444" }}>♥</span>)
          </span>
        </div>
      </div>
    </footer>
  );
}