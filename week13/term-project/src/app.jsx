// manually added imports after adding Dashboard page so that pages could display sep.
import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import MarketingPage from "./MarketingPage";
import DashboardPage from "./DashboardPage";
import "./app.css";

// manually fetched property ID from MongoDB Compass-- hardcoded into the component. 
// defines the main App component, create a React state variable, and handles data fetching and error handling.
function App() {
  const propertyId = "69daa0279a1fca619bdd8760";
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

// main render. Altered after adding dashboard page to allow pages to render sep. and not all on one singlular page. 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingPage property={property} />} />
        <Route path="/dashboard" element={<DashboardPage property={property} />} />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;