import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function MouseFollower() {
  const [visible,    setVisible]    = useState(false);
  const [onText,     setOnText]     = useState(false);
  const [clicking,   setClicking]   = useState(false);
  const [clickPos,   setClickPos]   = useState({ x: 0, y: 0 });
  const [burst,      setBurst]      = useState(false);
  const burstKey = useRef(0);

  const mouseX = useMotionValue(-600);
  const mouseY = useMotionValue(-600);

  const dotX  = useSpring(mouseX, { stiffness: 600, damping: 35 });
  const dotY  = useSpring(mouseY, { stiffness: 600, damping: 35 });
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22 });
  const blobX = useSpring(mouseX, { stiffness: 55,  damping: 20 });
  const blobY = useSpring(mouseY, { stiffness: 55,  damping: 20 });

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      // Detect if cursor is over text
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isText = el && (
        ["P", "H1", "H2", "H3", "H4", "H5", "H6", "SPAN", "BLOCKQUOTE", "LI"].includes(el.tagName) ||
        el.classList.contains("text-magnify")
      );
      setOnText(!!isText);
    };

    const onDown = (e) => {
      setClicking(true);
      setClickPos({ x: e.clientX, y: e.clientY });
      burstKey.current += 1;
      setBurst(false);
      requestAnimationFrame(() => setBurst(true));
      setTimeout(() => setBurst(false), 600);
    };
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove",  onMove, { passive: true });
    window.addEventListener("mousedown",  onDown);
    window.addEventListener("mouseup",    onUp);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  const accent = onText ? "#F5A623" : "#1A6FE8";

  return (
    <>
      {/* SVG filter for watery distortion */}
      <svg style={{ position: "fixed", width: 0, height: 0 }} aria-hidden>
        <defs>
          <filter id="water-lens">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" seed="2" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={onText ? 14 : 0} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>

        {/* Ambient blob */}
        <motion.div style={{
          position: "fixed", top: 0, left: 0,
          x: blobX, y: blobY,
          translateX: "-50%", translateY: "-50%",
          width: 500, height: 500, borderRadius: "50%",
          background: onText
            ? "radial-gradient(circle, rgba(245,166,35,0.08) 0%, rgba(245,166,35,0.02) 45%, transparent 70%)"
            : "radial-gradient(circle, rgba(26,111,232,0.09) 0%, rgba(26,111,232,0.02) 45%, transparent 70%)",
          opacity: visible ? 1 : 0,
          transition: "background 0.5s, opacity 0.3s",
        }} />

        {/* Watery lens — only on text */}
        <motion.div
          style={{
            position: "fixed", top: 0, left: 0,
            x: ringX, y: ringY,
            translateX: "-50%", translateY: "-50%",
            pointerEvents: "none",
          }}
          animate={{
            width:  onText ? 90  : clicking ? 22 : 32,
            height: onText ? 90  : clicking ? 22 : 32,
            opacity: visible ? 1 : 0,
          }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div style={{
            width: "100%", height: "100%",
            borderRadius: "50%",
            border: `1.5px solid ${accent}${onText ? "80" : "55"}`,
            background: onText
              ? `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08) 0%, ${accent}12 40%, transparent 70%)`
              : "transparent",
            boxShadow: onText
              ? `0 0 20px ${accent}35, 0 0 40px ${accent}15, inset 0 1px 0 rgba(255,255,255,0.15), inset 0 0 16px ${accent}08`
              : `0 0 8px ${accent}35`,
            transition: "border-color 0.25s, box-shadow 0.25s, background 0.25s",
            transform: clicking ? "scale(0.75)" : "scale(1)",
            backdropFilter: onText ? "blur(0.5px) brightness(1.08)" : "none",
          }} />
          {/* Highlight glint inside lens */}
          {onText && (
            <div style={{
              position: "absolute", top: "18%", left: "22%",
              width: "28%", height: "12%",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              filter: "blur(2px)",
              transform: "rotate(-30deg)",
            }} />
          )}
        </motion.div>

        {/* Precise dot */}
        <motion.div style={{
          position: "fixed", top: 0, left: 0,
          x: dotX, y: dotY,
          translateX: "-50%", translateY: "-50%",
          width: clicking ? 3 : 5, height: clicking ? 3 : 5,
          borderRadius: "50%",
          background: accent,
          opacity: visible && !onText ? 1 : 0,
          boxShadow: `0 0 8px ${accent}`,
          transition: "width 0.15s, height 0.15s, opacity 0.2s, background 0.25s",
        }} />

        {/* Click burst */}
        {burst && (
          <>
            <motion.div key={`b1-${burstKey.current}`} style={{
              position: "fixed", top: 0, left: 0,
              x: clickPos.x, y: clickPos.y,
              translateX: "-50%", translateY: "-50%",
            }}
              initial={{ width: 8, height: 8, opacity: 0.9 }}
              animate={{ width: 100, height: 100, opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.2, 0.8, 0.4, 1] }}
            >
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `1.5px solid ${accent}70`, boxShadow: `0 0 20px ${accent}40` }} />
            </motion.div>
            <motion.div key={`b2-${burstKey.current}`} style={{
              position: "fixed", top: 0, left: 0,
              x: clickPos.x, y: clickPos.y,
              translateX: "-50%", translateY: "-50%",
            }}
              initial={{ width: 8, height: 8, opacity: 0.5 }}
              animate={{ width: 60, height: 60, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: [0.2, 0.8, 0.4, 1] }}
            >
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", border: `1px solid ${accent}50` }} />
            </motion.div>
          </>
        )}
      </div>
    </>
  );
}