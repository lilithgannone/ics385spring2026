import React from "react";

function LiveStream() {
  return (
    <article className="dashboard-info-card dashboard-live-card">
      <h3>Kilauea Live Stream: Get Ready to Experience Kilauea</h3>
      <div className="stream-frame" aria-hidden="true">
        <iframe
          src="https://www.youtube.com/embed/HggWKlZv9yk?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&playsinline=1&loop=1&playlist=HggWKlZv9yk"
          title="Kilauea Live Stream"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </article>
  );
}

export default LiveStream;
