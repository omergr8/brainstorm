import React from "react";
import DragAndDrop from "../DragAndDrop";
import { Button } from "@mui/material";
import classes from "./Stepper.module.css";

const DocumentUpload = ({
  nextStep,
  prevStep,
  handleFileSelect,
  selectedFiles,
}) => {
  return (
    <div className={classes.main}>
      <h3 className={classes.mainHeading}>
        Please upload relevant documents to proceed:
      </h3>
      <div>
        <DragAndDrop
          onFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
          maxFileSizeMB={5} // Max file size in MB
          id="pdf-upload" // Unique ID for file input
        />
      </div>
      <div className={classes.nextContainer}>
        <Button onClick={prevStep} color="info" size="large" variant="contained">
          Back
        </Button>
        <Button color="error" size="large" variant="contained" onClick={nextStep}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default DocumentUpload;
