// import React so JSX can be used
import React from "react";
import ContactModal from "./ContactModal";

// creates a functional component called CTASection that takes in a property object and returns the JSX for the call-to-action section of the website, which includes a heading, a paragraph, and a mailto link for contacting the B&B
function CTASection({ property }) {
  return (
    <section id="contact">
      <h2>Special Upgrade Offer</h2>
      <p>{property.specialOffer}</p>
      <p>Ready to experience Lava Birds B&B?</p>
      <ContactModal buttonLabel={property.ctaText} />
    </section>
  );
}

// make the component available for import in other files
export default CTASection;
