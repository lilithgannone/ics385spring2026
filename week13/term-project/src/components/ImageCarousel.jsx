// import React so JSX and state can be used
import React, { useState } from "react";

// This component represents an image carousel, displaying 4 images at a time with left and right arrow buttons. 
function ImageCarousel({ property }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleImages = 4;
  const maxIndex = property.carouselImages.length - visibleImages;

  function showPreviousImage() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  function showNextImage() {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  return (
    <section className="image-carousel">
      <button className="carousel-button" onClick={showPreviousImage} disabled={currentIndex === 0}>
        &larr;
      </button>

      <div className="carousel-window">
        <div
          className="carousel-track"
          style={{ transform: `translateX(-${currentIndex * 25}%)` }}
        >
          {property.carouselImages.map((image, index) => (
            <div className="carousel-slide" key={index}>
              <img src={image.imageURL} alt={image.imageAlt} className="carousel-image" />
            </div>
          ))}
        </div>
      </div>

      <button className="carousel-button" onClick={showNextImage} disabled={currentIndex === maxIndex}>
        &rarr;
      </button>
    </section>
  );
}

// make the component available for import in other files
export default ImageCarousel;
