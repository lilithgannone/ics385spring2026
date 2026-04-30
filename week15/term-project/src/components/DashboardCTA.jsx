import React from "react";

function DashboardCTA({ property }) {
  return (
    <section className="dashboard-cta">
      <div className="dashboard-cta-media">
        <div className="stream-frame" aria-hidden="true">
          <iframe
            src="https://www.youtube.com/embed/Umlf7-iBlKQ?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&playsinline=1&loop=1&playlist=Umlf7-iBlKQ&start=20&end=80"
            title="Dashboard CTA video"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="dashboard-cta-content">
        <h3>See How Lava Birds B&B Fits Your Trip</h3>
        <p>
          Plan your trip at the right time for you. Compare island trends, weather,
          and visitor patterns with Lava Birds B&B's cozy and experience-driven offerings.
        </p>
        <a className="dashboard-cta-button" href={`mailto:${property.contactEmail}`}>
          {property.ctaText}
        </a>
      </div>
    </section>
  );
}

export default DashboardCTA;
