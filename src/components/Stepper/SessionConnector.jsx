import React from "react";
import { Button } from "@mui/material";
import classes from "./Stepper.module.css";

const SessionConnector = ({ prevStep, handleConnect }) => {
  return (
    <div className={classes.main}>
      <h3 className={classes.mainHeading}>
        Please click on connect to proceed
      </h3>
      <div className={classes.nextContainer}>
        <Button
          onClick={prevStep}
          color="info"
          size="large"
          variant="contained"
        >
          Back
        </Button>
        <Button
          color="error"
          size="large"
          variant="contained"
          onClick={handleConnect}
        >
          Connect
        </Button>
      </div>
    </div>
  );
};

export default SessionConnector;
