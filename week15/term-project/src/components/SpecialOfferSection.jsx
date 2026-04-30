// import React so JSX can be used 
import React from "react";
import ContactModal from "./ContactModal";

//manually coded spcial offer section, AI assisted with div. 
function SpecialOfferSection({ property }) {
  return (
    <section id="special-offer">
      <img src={property.specialImageURL} alt={property.specialImageAlt} />
    
      <div className="special-offer-content">
        <h2>{property.specialOffer}</h2>
        <p>{property.specialOfferDetails}</p>
        <ContactModal
          buttonLabel="Book Now or Ask About This Offer"
          buttonClassName="special-cta-button"
        />
      </div>
    </section>
  );
}

// make the component available for import in other files
export default SpecialOfferSection;
