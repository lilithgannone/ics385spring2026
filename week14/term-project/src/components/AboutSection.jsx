// import React so JSX can be used 
import React from "react";

// create a functional component so we can use "property.description" and other property values. It takes in the property object as a prop and renders the about section of the page. Some information is hardcoded. 
function AboutSection({ property }) {
  return (
    <section id="about">
      <div className="about-media">
        {/* add the video element and divide by class so I can have my desired styling as displayed in wireframe. */}
        <video className="about-main-video" controls loop muted autoPlay playsInline>
          <source src={property.lavaVideoURL} type="video/mp4" alt={property.lavaVideoAlt}/>
        </video>
        
        <div className="about-owner-card">
          <img src={property.ownerImageURL} alt={property.ownerImageAlt} />
        </div>
      </div>
      <div className="about-content">
        <h2>About Lava Birds B&B</h2>
        <p>{property.description}</p>
        <p>{property.locationSummary}</p>
        <p>
          Designed with {property.targetSegment.toLowerCase()} in mind, Lava Birds B&B offers experience-driven, cozy accommodations that feel special and memorable.
        </p>
        <p className="about-hosted-by"><strong>Hosted by {property.ownerName}</strong></p>
        <p>{property.ownerSummary}</p>
      </div>
    </section>
  );
}

// make the component available for import in other files
export default AboutSection;
