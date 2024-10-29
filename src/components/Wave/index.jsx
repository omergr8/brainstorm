// Waveform.js
import React from "react";
import styles from "./Waveform.module.css"; // Import the modular CSS

const Waveform = ({ intensity }) => {
  const barCount = 10; // Number of bars in the waveform
  return (
    <div className={styles.waveformContainer}>
      {Array.from({ length: barCount }).map((_, index) => (
        <div
          key={index}
          style={{
            height: `${Math.max(10, intensity * (50 + index * 5))}px`,
            background: `rgba(80, 180, 255, ${0.5 + (index / barCount) * 0.5})`,
            margin: "0 1px", // Small gap between bars
            width: "10px", // Increased width
            borderRadius: "1px",
            transition: "height 0.1s ease",
          }}
        />
      ))}
    </div>
  );
};

export default Waveform;
