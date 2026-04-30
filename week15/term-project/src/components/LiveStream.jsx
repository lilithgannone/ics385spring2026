import React from "react";

function LiveStream() {
  return (
    <article className="dashboard-info-card dashboard-live-card">
      <h3>Kilauea Live Stream: Get Ready to Experience Kilauea</h3>
      <div className="stream-frame" aria-hidden="true">
        <iframe
          src="https://www.youtube.com/embed/HggWKlZv9yk?si=U3aIr3Dvk-oS6Eeq&autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&playsinline=1"
          title="Kilauea Live Stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </article>
  );
}

export default LiveStream;
