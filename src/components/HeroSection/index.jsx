import React from "react";
import { Button } from "@mui/material";
import classes from "./HeroSection.module.css";

const HeroSection = ({ handleConnect }) => {
  return (
    <div className={classes.main}>
      <h2 className={classes.heading}>
        Welcome to Interactive Brainstorming Session Manager
      </h2>
      <p className={classes.text}>Please click on connect to proceed</p>
      <Button variant="contained" color="info" onClick={handleConnect}>
        Connect
      </Button>
    </div>
  );
};

export default HeroSection;
