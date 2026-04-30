import React from "react";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import ImageCarousel from "./components/ImageCarousel";
import AboutSection from "./components/AboutSection";
import AmenitiesSection from "./components/AmenitiesSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";
import SpecialOfferSection from "./components/SpecialOfferSection";
import ReviewSection from "./components/ReviewSection";

function MarketingPage({ property, onReviewAdded }) {
  return (
    <>
      <Header property={property} />
      <HeroSection property={property} />
      <SpecialOfferSection property={property} />
      <ImageCarousel property={property} />
      <AboutSection property={property} />
      <AmenitiesSection amenities={property.amenities} />
      <ReviewSection property={property} onReviewAdded={onReviewAdded} />
      <CTASection property={property} />
      <Footer />
    </>
  );
}

export default MarketingPage;
