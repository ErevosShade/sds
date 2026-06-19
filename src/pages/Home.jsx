import Navbar        from "../components/layout/Navbar";
import Hero          from "../components/home/Hero";
import WhatWeDo      from "../components/home/WhatWeDo";
import EventsSection from "../components/home/EventsSection";
import TeamSection   from "../components/home/TeamSection";
 
export default function Home() {
  return (
    <div style={{ background: "#050510" }}>
      <Navbar />

      <section id="hero">
        <Hero />
      </section>
 
      <section id="what-we-do">
        <WhatWeDo />
      </section>
 
      <section id="events">
        <EventsSection />
      </section>
 
      <section id="team">
        <TeamSection />
      </section>
    </div>
  );
}