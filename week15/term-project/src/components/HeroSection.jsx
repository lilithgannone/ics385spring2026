// import React so JSX can be used
import React from "react";

// This component represents the hero section of the website, displaying the property image, name, tagline, island location, and CTA button. 
function HeroSection({ property }) {
  return (
    <section id="home">
      <img src={property.imageURL} alt={property.heroImageAlt} />
      <h2>{property.name}</h2>
      <p>{property.island}</p>
      <p>{property.tagline}</p>
      <div className="hero-actions">
        <a className="hero-cta-button" href="#contact">View Special Offers</a>
       <a className="hero-secondary-button" href="#amenities">View Amenities</a>
      </div>
    </section>
  );
}

// make the component available for import in other files
export default HeroSection;
