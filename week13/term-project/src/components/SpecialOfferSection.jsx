// import React so JSX can be used 
import React from "react";


//manually coded spcial offer section, AI assisted with div. 
function SpecialOfferSection({ property }) {
  return (
    <section id="special-offer">
      <img src={property.specialImageURL} alt={property.specialImageAlt} />
    
      <div className="special-offer-content">
        <h2>{property.specialOffer}</h2>
        <p>{property.specialOfferDetails}</p>
        <a className="special-cta-button" href={`mailto:${property.contactEmail}`}>
          {property.ctaText}
      </a>
      </div>
    </section>
  );
}

// make the component available for import in other files
export default SpecialOfferSection;
