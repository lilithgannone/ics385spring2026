// coded using Keeper code as reference for manual changes and AI assitance for href lines.
// import React so JSX can be used
import React from "react";
import { Link } from "react-router-dom";
import ContactModal from "./ContactModal";

// This component represents the header of the website, including the title and navigation links.
function Header ({ property }) {
  const adminLoginUrl = "http://localhost:3000/admin/login";
  
  return (
    <header>
      <img src={property.logoURL} alt={property.logoImageAlt} />
      <h1>Lava Birds B&B</h1>
      <nav>
        <Link to="/">Home</Link>
        <a href="/#about">About</a>
        <a href="/#amenities">Amenities</a>
        <ContactModal buttonLabel="Contact" buttonClassName="nav-contact-button" />
        <Link to="/dashboard">Dashboard</Link>
        <a href={adminLoginUrl}>Admin</a>
      </nav>
    </header>
  );
}

// make the component available for import in other files
export default Header;
