import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, GitBranch, Link2  } from "lucide-react";

const TEAM = [
  {
    name: "Arjun Sharma",
    role: "President",
    initials: "AS",
    gradient: "linear-gradient(135deg, #1A6FE8, #4D91F0)",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Priya Nair",
    role: "Vice President",
    initials: "PN",
    gradient: "linear-gradient(135deg, #F5A623, #FFBE5C)",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Rohan Mehta",
    role: "Technical Lead",
    initials: "RM",
    gradient: "linear-gradient(135deg, #1258C0, #1A6FE8)",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Sneha Gupta",
    role: "Design Head",
    initials: "SG",
    gradient: "linear-gradient(135deg, #D4880A, #F5A623)",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Karan Verma",
    role: "Events Lead",
    initials: "KV",
    gradient: "linear-gradient(135deg, #1A6FE8, #1258C0)",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Ananya Singh",
    role: "Research Head",
    initials: "AS",
    gradient: "linear-gradient(135deg, #F5A623, #D4880A)",
    linkedin: "#",
    github: "#",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.10, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function TeamCard({ member }) {
  return (
    <motion.div variants={cardVariants} className="group relative">
      <div
        className="relative overflow-hidden rounded-2xl p-6 flex flex-col items-center gap-4 text-center transition-all duration-300"
        style={{
          background: "#0D0D1A",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(26,111,232,0.30)";
          e.currentTarget.style.boxShadow =
            "0 10px 36px rgba(0,0,0,0.45), 0 0 28px rgba(26,111,232,0.10)";
          e.currentTarget.style.transform = "translateY(-5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.35)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Hover bg wash */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(26,111,232,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Avatar */}
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            style={{
              background: member.gradient,
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {member.initials}
          </div>
          {/* Online indicator */}
          <span
            className="absolute bottom-1 right-1 w-3 h-3 rounded-full border-2"
            style={{
              background: "#22C55E",
              borderColor: "#0D0D1A",
              boxShadow: "0 0 8px rgba(34,197,94,0.6)",
            }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 relative z-10">
          <h3
            className="font-bold text-base"
            style={{ fontFamily: "'Syne', sans-serif", color: "#F0F0F0" }}
          >
            {member.name}
          </h3>
          <span
            className="text-xs font-semibold px-3 py-0.5 rounded-full"
            style={{
              color: "#1A6FE8",
              background: "rgba(26,111,232,0.10)",
              border: "1px solid rgba(26,111,232,0.20)",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {member.role}
          </span>
        </div>

        {/* Social links — slide up on hover */}
        <div
          className="flex items-center gap-3 relative z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
        >
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} LinkedIn`}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(26,111,232,0.12)",
              border: "1px solid rgba(26,111,232,0.25)",
              color: "#4D91F0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(26,111,232,0.24)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(26,111,232,0.12)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Link2  size={14} />
          </a>
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${member.name} GitHub`}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#A0A0B8",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              e.currentTarget.style.color = "#F0F0F0";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "#A0A0B8";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <GitBranch size={14} />
          </a>
          <a
            href="#"
            aria-label={`${member.name} profile`}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(245,166,35,0.10)",
              border: "1px solid rgba(245,166,35,0.22)",
              color: "#F5A623",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(245,166,35,0.20)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(245,166,35,0.10)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <ExternalLink size={13} />
          </a>
        </div>

        {/* Bottom border accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(26,111,232,0.5), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="team"
      ref={ref}
      className="relative py-24"
      style={{ background: "#050510" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(245,166,35,0.2), transparent)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{
              color: "#F5A623",
              background: "rgba(245,166,35,0.08)",
              border: "1px solid rgba(245,166,35,0.22)",
              letterSpacing: "0.12em",
            }}
          >
            Core team
          </span>
          <h2
            className="font-bold"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#F0F0F0",
            }}
          >
            The people behind SDS
          </h2>
          <p
            className="mt-3 max-w-md mx-auto text-base"
            style={{ color: "#606080", fontFamily: "'DM Sans', sans-serif" }}
          >
            Students who run the show — organising, building, and keeping the
            community alive.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-5 grid-cols-2 sm:grid-cols-3"
        >
          {TEAM.map((member) => (
            <TeamCard key={`${member.name}-${member.role}`} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
