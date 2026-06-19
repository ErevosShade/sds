import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, Zap, FlaskConical, Network } from "lucide-react";

const CARDS = [
  {
    icon: BookOpen,
    title: "Workshops",
    description:
      "Hands-on sessions covering Python, ML, deep learning, and data engineering — taught by seniors and industry mentors.",
    color: "#1A6FE8",
    tag: "Skill building",
  },
  {
    icon: Zap,
    title: "Hackathons",
    description:
      "Competitive build sprints where teams tackle real-world data problems under pressure and ship something that matters.",
    color: "#F5A623",
    tag: "Compete",
  },
  {
    icon: FlaskConical,
    title: "Research",
    description:
      "Collaborative student research groups exploring ML papers, publishing findings, and working on original experiments.",
    color: "#1A6FE8",
    tag: "Deep work",
  },
  {
    icon: Network,
    title: "Networking",
    description:
      "Direct connections with alumni and industry professionals through talks, AMAs, and referral opportunities.",
    color: "#F5A623",
    tag: "Community",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function WhatWeDoCard({ card }) {
  const Icon = card.icon;

  return (
    <motion.div variants={cardVariants} className="group relative">
      <div
        className="relative h-full overflow-hidden rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-all duration-300"
        style={{
          background: "#0D0D1A",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px) scale(1.01)";
          e.currentTarget.style.borderColor = `${card.color}45`;
          e.currentTarget.style.boxShadow = `0 12px 48px rgba(0,0,0,0.5), 0 0 40px ${card.color}15`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.4)";
        }}
      >
        {/* Hover glow wash */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% -10%, ${card.color}10 0%, transparent 70%)`,
          }}
        />

        {/* Top row: icon + tag */}
        <div className="flex items-center justify-between relative z-10">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: `${card.color}12`,
              border: `1px solid ${card.color}28`,
            }}
          >
            <Icon size={22} style={{ color: card.color }} strokeWidth={1.7} />
          </div>
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              color: card.color,
              background: `${card.color}12`,
              border: `1px solid ${card.color}25`,
              letterSpacing: "0.06em",
            }}
          >
            {card.tag}
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2 relative z-10">
          <h3
            className="font-bold text-xl"
            style={{ fontFamily: "'Syne', sans-serif", color: "#F0F0F0" }}
          >
            {card.title}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#808098", fontFamily: "'DM Sans', sans-serif" }}
          >
            {card.description}
          </p>
        </div>

        {/* Bottom accent bar — grows on hover */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px transition-all duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${card.color}70, transparent)`,
          }}
        />

        {/* Corner dot */}
        <div
          className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-300"
          style={{ background: card.color }}
        />
      </div>
    </motion.div>
  );
}

export default function WhatWeDo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="what-we-do"
      ref={ref}
      className="relative py-24"
      style={{ background: "#050510" }}
    >
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
            What we do
          </span>
          <h2
            className="font-bold"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#F0F0F0",
            }}
          >
            How SDS creates impact
          </h2>
          <p
            className="mt-3 max-w-lg mx-auto text-base"
            style={{ color: "#606080", fontFamily: "'DM Sans', sans-serif" }}
          >
            Four pillars that drive everything we do — from day-one learners to
            placement-ready engineers.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid gap-5 sm:grid-cols-2"
        >
          {CARDS.map((card) => (
            <WhatWeDoCard key={card.title} card={card} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
