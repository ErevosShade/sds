import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, CalendarDays, FolderGit2 } from "lucide-react";

const STATS = [
  {
    icon: Users,
    value: 150,
    suffix: "+",
    label: "Members",
    description: "Active data science enthusiasts",
    color: "#1A6FE8",
  },
  {
    icon: CalendarDays,
    value: 20,
    suffix: "+",
    label: "Events",
    description: "Workshops, talks & hackathons",
    color: "#F5A623",
  },
  {
    icon: FolderGit2,
    value: 30,
    suffix: "+",
    label: "Projects",
    description: "Built by SDS members",
    color: "#1A6FE8",
  },
];

function useCountUp(target, isActive, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isActive, target, duration]);

  return count;
}

function StatCard({ stat, index, isActive }) {
  const count = useCountUp(stat.value, isActive, 1600 + index * 200);
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isActive ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-6 h-full flex flex-col gap-4 transition-all duration-300"
        style={{
          background: "#0D0D1A",
          border: "1px solid rgba(26,111,232,0.18)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(26,111,232,0.45)";
          e.currentTarget.style.boxShadow =
            "0 8px 40px rgba(0,0,0,0.5), 0 0 32px rgba(26,111,232,0.12)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(26,111,232,0.18)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Background glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(26,111,232,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Top: icon + accent line */}
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${stat.color}15`,
              border: `1px solid ${stat.color}30`,
            }}
          >
            <Icon size={20} style={{ color: stat.color }} strokeWidth={1.8} />
          </div>
          {/* Decorative corner accent */}
          <div
            className="w-8 h-8 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, ${stat.color} 0%, transparent 70%)`,
              filter: "blur(6px)",
            }}
          />
        </div>

        {/* Count */}
        <div className="flex flex-col gap-1">
          <div
            className="font-bold leading-none tabular-nums"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.4rem, 5vw, 3.2rem)",
              color: "#F5A623",
              textShadow: "0 0 40px rgba(245,166,35,0.3)",
            }}
          >
            {count}
            <span style={{ color: "#F5A623", opacity: 0.7 }}>{stat.suffix}</span>
          </div>
          <div
            className="font-semibold text-lg"
            style={{ fontFamily: "'Syne', sans-serif", color: "#F0F0F0" }}
          >
            {stat.label}
          </div>
          <div
            className="text-sm leading-snug"
            style={{ color: "#606080", fontFamily: "'DM Sans', sans-serif" }}
          >
            {stat.description}
          </div>
        </div>

        {/* Bottom accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${stat.color}50, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="stats"
      ref={ref}
      className="relative py-20"
      style={{ background: "#050510" }}
    >
      {/* Subtle top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(26,111,232,0.3), rgba(245,166,35,0.2), transparent)",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full"
            style={{
              color: "#1A6FE8",
              background: "rgba(26,111,232,0.08)",
              border: "1px solid rgba(26,111,232,0.2)",
              letterSpacing: "0.12em",
            }}
          >
            By the numbers
          </span>
          <h2
            className="mt-4 font-bold"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: "#F0F0F0",
            }}
          >
            SDS at a glance
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} isActive={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
