import React, { useEffect, useState } from "react";
import "./Gallery.css";

const Gallery = () => {
  const gallery = [
    ["/img1.webp", "/img2.jpg", "/img3.jpg"],
    ["/img4.jpg", "/img7.jpg", "/img8.jpg"],
    ["/img5.jpg", "/img6.jpg", "/img1.webp"],
  ];

  const [indexes, setIndexes] = useState([
    [0, 1, 2],
    [0, 1, 2],
    [0, 1, 2],
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndexes((prev) =>
        prev.map((col, colIndex) =>
          col.map((_, rowIndex) => (prev[colIndex][rowIndex] + 1) % gallery[colIndex].length)
        )
      );
    }, 4000); // change every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="gallery" id="about">
      <h1>BETTER BEATS BEST</h1>
      <div className="images">
        {gallery.map((group, colIndex) => (
          <div className="column" key={colIndex}>
            {indexes[colIndex].map((imgIndex, rowIndex) => (
              <img
  key={`${colIndex}-${rowIndex}-${imgIndex}`} // This ensures a new key triggers the animation
  src={group[imgIndex]}
  alt={`gallery-${colIndex}-${rowIndex}`}
  className="fade-image"
/>

            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
