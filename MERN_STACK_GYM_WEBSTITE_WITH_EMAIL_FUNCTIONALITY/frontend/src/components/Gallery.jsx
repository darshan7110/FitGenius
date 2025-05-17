import React, { useEffect, useState } from "react";
import "./Gallery.css"; // Importing gallery-specific styles

// ===== MAIN GALLERY COMPONENT =====
const Gallery = () => {
  // === IMAGE GROUPINGS FOR EACH COLUMN ===
  const gallery = [
    ["/img1.webp", "/img2.jpg", "/img3.jpg"], // Column 1
    ["/img4.jpg", "/img7.jpg", "/img8.jpg"],  // Column 2
    ["/img5.jpg", "/img6.jpg", "/img1.webp"], // Column 3
  ];

  // === INDEXES TO TRACK WHICH IMAGE IS DISPLAYED PER COLUMN & ROW ===
  const [indexes, setIndexes] = useState([
    [0, 1, 2], // Initial indexes for column 1
    [0, 1, 2], // Column 2
    [0, 1, 2], // Column 3
  ]);

  // === CYCLE IMAGES EVERY 4 SECONDS WITH A LOOPING INDEX ===
  useEffect(() => {
    const interval = setInterval(() => {
      setIndexes((prev) =>
        prev.map((col, colIndex) =>
          col.map((_, rowIndex) =>
            // Loop to next image index or go back to start
            (prev[colIndex][rowIndex] + 1) % gallery[colIndex].length
          )
        )
      );
    }, 4000); // Image switch interval (4 seconds)

    // Clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="gallery" id="about">
      {/* === SECTION TITLE === */}
      <h1>BETTER BEATS BEST</h1>

      {/* === IMAGE GRID: 3 COLUMNS, IMAGES INSIDE EACH === */}
      <div className="images">
        {gallery.map((group, colIndex) => (
          <div className="column" key={colIndex}>
            {indexes[colIndex].map((imgIndex, rowIndex) => (
              <img
                key={`${colIndex}-${rowIndex}-${imgIndex}`} // Unique key to re-trigger animations
                src={group[imgIndex]}                      // Image source from gallery array
                alt={`gallery-${colIndex}-${rowIndex}`}    // Alt tag for accessibility
                className="fade-image"                     // Animation class (optional style)
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery; // Exporting component for use in other files
