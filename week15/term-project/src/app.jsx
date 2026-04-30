// manually added imports after adding Dashboard page so that pages could display sep.
import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import MarketingPage from "./MarketingPage";
import DashboardPage from "./DashboardPage";
import "./app.css";

// Fetches the main Lava Birds B&B property from the backend.
// defines the main App component, create a React state variable, and handles data fetching and error handling.
function App() {
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  

  async function loadProperty() {
    try {
      //Sends an HTTP request to backend.
      const response = await fetch("/api/properties/primary");


//checks if the response is successful. If not, send error message. If successful, parse the response as JSON and update the property state with the fetched data.
      if (!response.ok) {
        throw new Error("Failed to fetch property data.");
      }

      const data = await response.json();
      setProperty(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }
// runs the fetch logic.
  useEffect(() => {
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
        <Route 
          path="/" 
          element={<MarketingPage property={property} onReviewAdded={loadProperty} />} 
        />
        <Route path="/dashboard" element={<DashboardPage property={property} />} />      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
