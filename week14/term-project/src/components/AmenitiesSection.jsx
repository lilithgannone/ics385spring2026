// import React so JSX can be used, ensures that the amenities section is properly displaying the list of amenities provided by the B&B. 
// The [] syntax is used to set a default value for the amenities prop, ensuring that the component can render even if no amenities are passed in. 
import React from "react";

function AmenitiesSection({ amenities = [] }) {
  return (
    <section id="amenities">
      <h2>Amenities</h2>
      <ul>
        {amenities.map((amenity, index) => (
          <li key={index}>{amenity}</li>
        ))}
      </ul>
    </section>
  );
}

// make the component available for import in other files
export default AmenitiesSection;
