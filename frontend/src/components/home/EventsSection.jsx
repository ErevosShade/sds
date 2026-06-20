import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { CalendarDays, MapPin, Zap } from "lucide-react";

const EVENTS = [
  {
    title: "DataQuest 2024",
    tag: "Hackathon",
    date: "March 15, 2024",
    venue: "BIT Mesra Main Hall",
    description: "24-hour inter-college data science hackathon. 200+ participants solving real healthcare datasets under pressure.",
    status: "completed",
    side: "right",
    accentColor: "#1A6FE8",
  },
  {
    title: "ML Foundations Bootcamp",
    tag: "Workshop",
    date: "April 3–5, 2024",
    venue: "CS Seminar Room",
    description: "3-day deep-dive into supervised learning, model evaluation, and scikit-learn. Beginner to intermediate.",
    status: "completed",
    side: "left",
    accentColor: "#F5A623",
  },
  {
    title: "Industry Connect",
    tag: "Talk",
    date: "August 10, 2024",
    venue: "Online + BIT Campus",
    description: "Panel AMA with data scientists from top product companies — placements, career paths, and portfolio advice.",
    status: "upcoming",
    side: "right",
    accentColor: "#1A6FE8",
  },
  {
    title: "SDS Annual Summit 2024",
    tag: "Summit",
    date: "September 22, 2024",
    venue: "BIT Mesra Auditorium",
    description: "Project showcases, alumni talks, live ML demos, and a full networking mixer. The flagship event.",
    status: "upcoming",
    side: "left",
    accentColor: "#F5A623",
  },
];

function EventCard({ event }) {
  const isUpcoming = event.status === "upcoming";
  return (
    <div
      className="group relative rounded-2xl p-5 transition-all duration-300 overflow-hidden"
      style={{ background: "#0D0D1A", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${event.accentColor}40`;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0,0,0,0.5), 0 0 28px ${event.accentColor}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.4)";
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${event.accentColor}70, transparent)` }} />
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ color: event.accentColor, background: `${event.accentColor}15`, border: `1px solid ${event.accentColor}28` }}>
          {event.tag}
        </span>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
          style={isUpcoming
            ? { color: "#F5A623", background: "rgba(245,166,35,0.10)", border: "1px solid rgba(245,166,35,0.28)" }
            : { color: "#606080", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}>
          {isUpcoming && <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5A623", boxShadow: "0 0 6px #F5A623" }} />}
          {isUpcoming ? "Upcoming" : "Completed"}
        </span>
      </div>
      <h3 className="font-bold text-lg leading-snug mb-2" style={{ fontFamily: "'Syne', sans-serif", color: "#F0F0F0" }}>{event.title}</h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#808098", fontFamily: "'DM Sans', sans-serif" }}>{event.description}</p>
      <div className="flex flex-col gap-1.5 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2"><CalendarDays size={12} style={{ color: "#606080" }} /><span className="text-xs" style={{ color: "#606080" }}>{event.date}</span></div>
        <div className="flex items-center gap-2"><MapPin size={12} style={{ color: "#606080" }} /><span className="text-xs" style={{ color: "#606080" }}>{event.venue}</span></div>
      </div>
    </div>
  );
}

function EventNode({ event, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-15% 0px -15% 0px" });
  const isLeft = event.side === "left";

  return (
    <div ref={ref} className="relative flex items-center" style={{ minHeight: 160, marginBottom: index < EVENTS.length - 1 ? 72 : 0 }}>
      {/* Left card */}
      <div className="flex-1 flex justify-end pr-10" style={{ visibility: isLeft ? "visible" : "hidden" }}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.94, filter: "blur(4px)" }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, x: 40, scale: 0.94, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: 360, width: "100%" }}
          >
            <EventCard event={event} />
          </motion.div>
        )}
      </div>

      {/* Center spine node */}
      <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 40, zIndex: 10 }}>
        {/* Left branch */}
        {isLeft && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", right: "50%", top: "50%", marginTop: -0.5, width: 100, height: 1, background: `linear-gradient(90deg, transparent, ${event.accentColor}70, ${event.accentColor})`, transformOrigin: "right center" }}
          />
        )}
        {/* Node dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.12, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ width: 16, height: 16, borderRadius: "50%", background: event.accentColor, border: "3px solid #050510", boxShadow: isInView ? `0 0 0 4px ${event.accentColor}25, 0 0 20px ${event.accentColor}70` : "none", transition: "box-shadow 0.4s ease", zIndex: 10, position: "relative" }}
        />
        {/* Right branch */}
        {!isLeft && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", left: "50%", top: "50%", marginTop: -0.5, width: 100, height: 1, background: `linear-gradient(90deg, ${event.accentColor}, ${event.accentColor}70, transparent)`, transformOrigin: "left center" }}
          />
        )}
      </div>

      {/* Right card */}
      <div className="flex-1 flex justify-start pl-10" style={{ visibility: isLeft ? "hidden" : "visible" }}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40, scale: 0.94, filter: "blur(4px)" }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" } : { opacity: 0, x: -40, scale: 0.94, filter: "blur(4px)" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxWidth: 360, width: "100%" }}
          >
            <EventCard event={event} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function MobileEventCard({ event }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div ref={ref} className="relative pl-7"
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute left-0 top-6 w-px bottom-0" style={{ background: `${event.accentColor}25` }} />
      <motion.div className="absolute rounded-full"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        style={{ left: -5, top: 22, width: 11, height: 11, background: event.accentColor, border: "2px solid #050510", boxShadow: `0 0 12px ${event.accentColor}70` }}
      />
      <div className="mb-5"><EventCard event={event} /></div>
    </motion.div>
  );
}

export default function EventsSection() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 25%"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 18, restDelta: 0.001 });
  const lineScaleY     = useTransform(smoothProgress, [0, 1], [0, 1]);
  const chargeDotY     = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const chargeOpacity  = useTransform(smoothProgress, [0, 0.04, 0.93, 1], [0, 1, 1, 0]);
  const glowSize       = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1.5, 0.7]);

  return (
    <section id="events" ref={sectionRef} className="relative py-24" style={{ background: "#050510" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(26,111,232,0.25), rgba(245,166,35,0.15), transparent)" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ color: "#1A6FE8", background: "rgba(26,111,232,0.08)", border: "1px solid rgba(26,111,232,0.20)", letterSpacing: "0.12em" }}>
            <Zap size={11} strokeWidth={2.5} /> Events
          </span>
          <h2 className="font-bold" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#F0F0F0" }}>
            What we've been building
          </h2>
          <p className="mt-3 text-base" style={{ color: "#606080", fontFamily: "'DM Sans', sans-serif" }}>
            Scroll to trace the timeline
          </p>
        </motion.div>

        {/* ── DESKTOP: Network bus ── */}
        <div className="relative hidden md:block">
          {/* Track (dim background wire) */}
          <div className="absolute top-0 bottom-0" style={{ left: "50%", width: 2, transform: "translateX(-50%)", background: "rgba(26,111,232,0.08)", borderRadius: 999 }} />

          {/* Animated fill wire */}
          <motion.div className="absolute top-0 origin-top" style={{ left: "50%", width: 2, height: "100%", transform: "translateX(-50%)", background: "linear-gradient(180deg, #1A6FE8 0%, #4D91F0 30%, #F5A623 70%, #1A6FE8 100%)", borderRadius: 999, scaleY: lineScaleY }} />

          {/* Charge dot */}
          <motion.div className="absolute pointer-events-none" style={{ left: "50%", top: chargeDotY, opacity: chargeOpacity, zIndex: 30 }}>
            {/* Outer pulse ring */}
            <motion.div style={{ position: "absolute", width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle, rgba(26,111,232,0.5) 0%, rgba(26,111,232,0.1) 50%, transparent 70%)", scale: glowSize, x: "-50%", y: "-50%" }} />
            {/* Second ring */}
            <motion.div style={{ position: "absolute", width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(26,111,232,0.4)", scale: glowSize, x: "-50%", y: "-50%" }} />
            {/* Core dot */}
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "linear-gradient(135deg, #7DB5F8, #1A6FE8)", boxShadow: "0 0 0 2px rgba(26,111,232,0.3), 0 0 16px rgba(26,111,232,0.9), 0 0 40px rgba(26,111,232,0.5)", transform: "translate(-50%, -50%)" }} />
          </motion.div>

          {/* Event nodes */}
          <div className="relative" style={{ padding: "20px 0" }}>
            {EVENTS.map((event, i) => <EventNode key={event.title} event={event} index={i} />)}
          </div>
        </div>

        {/* ── MOBILE: left spine ── */}
        <div className="md:hidden relative" style={{ paddingLeft: 4 }}>
          <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "rgba(26,111,232,0.10)" }} />
          <motion.div className="absolute left-0 top-0 w-px origin-top" style={{ height: "100%", background: "linear-gradient(180deg, #1A6FE8, #F5A623, #1A6FE8)", scaleY: lineScaleY }} />
          <div className="flex flex-col gap-4">
            {EVENTS.map((event, i) => <MobileEventCard key={event.title} event={event} index={i} />)}
          </div>
        </div>

      </div>
    </section>
  );
}