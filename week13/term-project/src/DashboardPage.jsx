import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./Dashboard";

function DashboardPage({ property }) {
  return (
    <>
      <Header property={property} />
      <Dashboard property={property} />
      <Footer />
    </>
  );
}

export default DashboardPage;
