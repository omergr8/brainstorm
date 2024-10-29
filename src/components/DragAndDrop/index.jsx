import React, { useState } from "react";
import styles from "./DragAndDrop.module.css";

const DragAndDrop = ({
  onFileSelect,
  selectedFiles,
  maxFileSizeMB,
  height = "260px",
  borderColor = "#211749",
  textColor = "black",
  error,
  id,
}) => {
  const [dragging, setDragging] = useState(false);
  const [fileErrors, setFileErrors] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files) => {
    const validFiles = [...selectedFiles];
    const errors = [];

    Array.from(files).forEach((file) => {
      if (file.type !== "application/pdf") {
        errors.push(`${file.name} is not a PDF file.`);
      } else if (file.size > maxFileSizeMB * 1024 * 1024) {
        errors.push(
          `${file.name} exceeds the size limit of ${maxFileSizeMB}MB.`
        );
      } else {
        validFiles.push(file);
      }
    });

    setFileErrors(errors);
    onFileSelect(validFiles);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  return (
    <div>
      <div
        className={`${styles.dropArea} ${dragging ? styles.dragging : ""}`}
        style={{ height, borderColor }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById(id)?.click()}
      >
        <input
          type="file"
          id={id}
          accept="application/pdf"
          multiple // Support multiple files
          style={{ display: "none" }}
          onChange={handleChange}
        />
        <div className={styles.content}>
          <p >
            Drag PDF files here or <span>Click to browse</span>
          </p>
          {selectedFiles &&
            selectedFiles.length > 0 &&
            selectedFiles.map((file, index) => (
              <li key={index}>
                {file.name} - {(file.size / (1024 * 1024)).toFixed(2)} MB
              </li>
            ))}
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
      {fileErrors.length > 0 && (
        <div className={styles.errorText}>
          {fileErrors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      <div className={styles.info}>
        <p>Supported file type: PDF</p>
        <p>Max file size: {maxFileSizeMB}MB</p>
      </div>
    </div>
  );
};

export default DragAndDrop;
