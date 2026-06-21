import Hero               from "../components/home/Hero";
import WhatWeDo           from "../components/home/WhatWeDo";
import EventsSection      from "../components/home/EventsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import Footer             from "../components/layout/Footer";

export default function Home() {
  return (
    <div style={{ background: "#050510" }}>
      <Hero />
      <WhatWeDo />
      <EventsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
