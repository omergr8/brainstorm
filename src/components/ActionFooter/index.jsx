import React from "react";
import { Button } from "@mui/material";
import Waveform from "../Wave";
import classes from "./ActionFooter.module.css";

const ActionFooter = ({ handleEnd, intensity }) => {
  const meetingId = localStorage.getItem("meetingId");
  return (
    <div className={classes.main}>
      <div className="container">
        {/* <h2 className={classes.heading}>Control</h2> */}
        <div className={classes.box}>
          <p>Meeting-ID: {meetingId}</p>
          <Waveform intensity={intensity} />
        <div>
        <Button variant="contained" color="error" onClick={handleEnd}>
            End Meeting
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ActionFooter;
