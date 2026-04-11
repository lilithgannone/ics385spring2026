// manually added imports after the "import { useEffect, useState } from "react";" import.
import React from "react";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ImageCarousel from "./components/ImageCarousel";
import AboutSection from "./components/AboutSection";
import AmenitiesSection from "./components/AmenitiesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import "./app.css";
import SpecialOfferSection from "./components/SpecialOfferSection";

// manually fetched property ID from MongoDB Compass-- hardcoded into the component. 
// defines the main App component, create a React state variable, and handles data fetching and error handling.
function App() {
  const propertyId = "69da05500986d5dc44e4af9c";
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  

  useEffect(() => {
    async function loadProperty() {
      try {
        //Sends an HTTP request to backend.
        const response = await fetch(`http://localhost:3000/api/properties/${propertyId}`)

//checks if the response is successful. If not, send error message. If successful, parse the response as JSON and update the property state with the fetched data.
        if (!response.ok) {
          throw new Error("Failed to fetch property data.");
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      }
    }
// runs the fetch logic.
    loadProperty();
// Make sure the fetch happens on initial page load only. 
  }, []);

  if (error) {
    return <p>{error}</p>;
  }
  if (!property) {
    return <p>Loading...</p>;
  }

// main render. 
  return (
    <>
      <Header property={property}/>
      <HeroSection property={property} />
      <SpecialOfferSection property={property} />
      <ImageCarousel property={property} />
      <AboutSection property={property} />
      <AmenitiesSection amenities={property.amenities} />
      <CTASection property={property} />
      <Footer />
    </>
  );
}

export default App;