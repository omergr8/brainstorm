import React from "react";
import styles from "./OverlayLoader.module.css";
import CircularProgress from "@mui/material/CircularProgress";

const OverlayLoader = ({ text }) => {
  return (
    <div className={`${styles.overlay}`}>
      <div className={styles.loaderBox}>
        <div className={styles.loaderContent}>
          <CircularProgress />
          <p className={styles.loadingText}>Loading...</p>
        </div>
        {text != null && (
          <div className={`${styles.text}`}>
            <p>[</p>
            <p>{text}</p>
            <p>]</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverlayLoader;
