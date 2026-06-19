import { useEffect, useRef, useMemo } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import sdsLogo from "../../assets/sds-logo.jpg";

// ─── Particle config ─────────────────────────────────────────────────────────
const PARTICLE_COUNT = 56;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,           // vw %
    y: Math.random() * 100,           // vh %
    size: Math.random() * 2.5 + 0.8,  // px
    duration: Math.random() * 6 + 5,  // float cycle seconds
    delay: Math.random() * 4,         // stagger
    opacity: Math.random() * 0.45 + 0.08,
    // Roughly 60% blue-toned, 40% orange-toned
    color: Math.random() > 0.4 ? "#1A6FE8" : "#F5A623",
    driftX: (Math.random() - 0.5) * 30,  // horizontal float range px
    driftY: (Math.random() - 0.5) * 20,
  }));
}

// ─── Framer Motion variants ───────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.25,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// ─── Gradient orb data ───────────────────────────────────────────────────────
const ORBS = [
  {
    id: "orb-blue-1",
    style: {
      width: "65vw", height: "65vw",
      top: "-18%", left: "-12%",
      background: "radial-gradient(circle, #1A6FE822 0%, #1A6FE808 45%, transparent 70%)",
      animationDuration: "18s",
      animationDelay: "0s",
    },
  },
  {
    id: "orb-orange-1",
    style: {
      width: "50vw", height: "50vw",
      bottom: "-10%", right: "-8%",
      background: "radial-gradient(circle, #F5A62318 0%, #F5A62306 45%, transparent 70%)",
      animationDuration: "22s",
      animationDelay: "-6s",
    },
  },
  {
    id: "orb-blue-2",
    style: {
      width: "35vw", height: "35vw",
      top: "30%", right: "15%",
      background: "radial-gradient(circle, #1A6FE814 0%, transparent 65%)",
      animationDuration: "28s",
      animationDelay: "-12s",
    },
  },
  {
    id: "orb-orange-2",
    style: {
      width: "28vw", height: "28vw",
      top: "10%", right: "35%",
      background: "radial-gradient(circle, #F5A62310 0%, transparent 65%)",
      animationDuration: "15s",
      animationDelay: "-4s",
    },
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  const particles = useMemo(() => generateParticles(), []);
  const scrollRef = useRef(null);

  const handleScrollDown = () => {
    const next = document.getElementById("about");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ background: "#050510" }}
    >
      {/* ── Gradient orbs ───────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {ORBS.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              ...orb.style,
              animation: `orbDrift ${orb.style.animationDuration} ease-in-out infinite alternate`,
              animationDelay: orb.style.animationDelay,
              willChange: "transform",
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* ── Noise grain overlay ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── Grid lines ──────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(26,111,232,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,111,232,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)",
        }}
      />

      {/* ── Floating particles ──────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 3}px ${p.color}80`,
            }}
            animate={{
              x: [0, p.driftX, 0],
              y: [0, p.driftY, 0],
              opacity: [p.opacity, p.opacity * 0.4, p.opacity],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ── Horizontal scan line ────────────────────────────────────────── */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, #1A6FE840, #F5A62330, transparent)",
        }}
        animate={{ top: ["15%", "85%", "15%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Navbar strip ────────────────────────────────────────────────── */}
      <motion.nav
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 flex items-center justify-between px-6 md:px-12 pt-6 pb-4"
        style={{
          borderBottom: "1px solid rgba(26,111,232,0.10)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl overflow-hidden flex-shrink-0"
            style={{
              width: 42,
              height: 42,
              background: "#0D0D1A",
              border: "1px solid rgba(26,111,232,0.25)",
              padding: "5px",
            }}
          >
            <img
              src={sdsLogo}
              alt="SDS logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span
              className="font-bold tracking-wide text-sm"
              style={{ fontFamily: "'Syne', sans-serif", color: "#F0F0F0" }}
            >
              SDS
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: "#606080", letterSpacing: "0.04em" }}
            >
              BIT Mesra
            </span>
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["About", "Events", "Team"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#A0A0B8" }}
              onMouseEnter={(e) => (e.target.style.color = "#F0F0F0")}
              onMouseLeave={(e) => (e.target.style.color = "#A0A0B8")}
            >
              {link}
            </a>
          ))}
          <a
            href="/tools"
            className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200"
            style={{
              background: "rgba(26,111,232,0.12)",
              color: "#4D91F0",
              border: "1px solid rgba(26,111,232,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(26,111,232,0.22)";
              e.currentTarget.style.borderColor = "rgba(26,111,232,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26,111,232,0.12)";
              e.currentTarget.style.borderColor = "rgba(26,111,232,0.25)";
            }}
          >
            AI Tools ✦
          </a>
        </div>
      </motion.nav>

      {/* ── Hero content ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 md:px-12 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center max-w-5xl mx-auto gap-6"
        >
          {/* Eyebrow label */}
          <motion.div variants={fadeUpVariants}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(245,166,35,0.08)",
                border: "1px solid rgba(245,166,35,0.25)",
                color: "#F5A623",
                letterSpacing: "0.12em",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#F5A623", boxShadow: "0 0 6px #F5A623" }}
              />
              Society for Data Science — BIT Mesra
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="font-bold leading-[1.05] tracking-tight"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
              color: "#F0F0F0",
            }}
          >
            Where{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #4D91F0 0%, #1A6FE8 50%, #F5A623 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Data
            </span>{" "}
            Meets
            <br className="hidden sm:block" />{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #F5A623 0%, #FFBE5C 60%, #4D91F0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Innovation
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUpVariants}
            className="max-w-xl mx-auto leading-relaxed"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
              color: "#A0A0B8",
            }}
          >
            The official hub for data enthusiasts at BIT Mesra — building skills,
            running workshops, shipping projects, and shaping futures through
            the power of data science.
          </motion.p>

          {/* Stats row */}
          <motion.div
            variants={fadeUpVariants}
            className="flex items-center gap-6 md:gap-10"
          >
            {[
              { value: "200+", label: "Members" },
              { value: "30+", label: "Events" },
              { value: "50+", label: "Projects" },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-6 md:gap-10">
                <div className="flex flex-col items-center">
                  <span
                    className="font-bold"
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "clamp(1.4rem, 3vw, 2rem)",
                      background: "linear-gradient(135deg, #F0F0F0, #A0A0B8)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "#606080", letterSpacing: "0.1em" }}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className="hidden sm:block w-px h-8 self-center"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, #2A2A4A, transparent)",
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-2"
          >
            {/* Primary CTA */}
            <motion.a
              href="/tools"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-white overflow-hidden"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                background: "linear-gradient(135deg, #1A6FE8, #1258C0)",
                boxShadow: "0 0 0 1px rgba(26,111,232,0.4), 0 4px 24px rgba(26,111,232,0.3)",
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {/* Hover gradient sweep */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #4D91F0, #1A6FE8, #F5A623)",
                }}
              />
              <span className="relative z-10 flex items-center gap-2.5">
                Explore AI Tools
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </span>
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              href="#about"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold transition-all duration-200"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "#A0A0B8",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.10)",
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(26,111,232,0.4)";
                e.currentTarget.style.color = "#F0F0F0";
                e.currentTarget.style.background = "rgba(26,111,232,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
                e.currentTarget.style.color = "#A0A0B8";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              }}
            >
              Learn About Us
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Bottom fade + scroll cue ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center pb-10 gap-3">
        {/* Scroll cue */}
        <motion.button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          aria-label="Scroll to next section"
        >
          <span
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: "#3A3A5A", letterSpacing: "0.14em" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown
              size={18}
              className="transition-colors duration-200 group-hover:text-blue-400"
              style={{ color: "#3A3A5A" }}
            />
          </motion.div>
        </motion.button>
      </div>

      {/* ── Bottom edge gradient ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, #050510, transparent)",
        }}
      />

      {/* ── Inline keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes orbDrift {
          0%   { transform: translate(0,    0)    scale(1);    }
          33%  { transform: translate(3%,  -4%)   scale(1.06); }
          66%  { transform: translate(-2%,  3%)   scale(0.96); }
          100% { transform: translate(4%,   1%)   scale(1.03); }
        }
      `}</style>
    </section>
  );
}
