import React from "react";
import styles from "./CustomInput.module.css";

const CustomInput = ({
  label,
  placeholder,
  value,
  lineColor = "red",
  onChange,
}) => {
  return (
    <div className={styles.inputContainer}>
      <label className={styles.inputLabel}>{label}</label>
      <div className={styles.inputBoxContainer}>
        <div
          className={lineColor === "red" ? styles.redLine : styles.greenLine}
        ></div>
        <input
          type="text"
          className={styles.inputBox}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default CustomInput;
