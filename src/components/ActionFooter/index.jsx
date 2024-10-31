// React and Core Library Imports
import React from "react";
// Third-party Library Imports
import { Button } from "@mui/material";
// Component Imports
import Waveform from "../Wave";
// Styles
import classes from "./ActionFooter.module.css";


const ActionFooter = ({ handleEnd, intensity, isEnd }) => {
  const meetingId = localStorage.getItem("meetingId");
  return (
    <div className={classes.main}>
      <div className="container">
        {/* <h2 className={classes.heading}>Control</h2> */}
        <div className={classes.box}>
          <p>Meeting-ID: {meetingId}</p>
          <Waveform intensity={intensity} />
          <div>
            {isEnd ? (
              <p>The meeting has ended</p>
            ) : (
              <Button
                variant="contained"
                color="error"
                onClick={handleEnd}
                disabled={isEnd}
              >
                End Meeting
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionFooter;
