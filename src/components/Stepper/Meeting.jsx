import React from "react";
import { Button, TextField } from "@mui/material";
import CustomInput from "../CustomInput";
import classes from "./Stepper.module.css";

const Meeting = ({
  nextStep,
  handleCreateMeeting,
  handleJoinMeeting,
  meetingId,
  setMeetingId,
}) => {
  return (
    <div className={classes.meetingMain}>
      <h3 className={classes.mainHeading}>Please Create a new meeting</h3>
      <Button variant="contained" color="primary" onClick={handleCreateMeeting}>
        Create Meeting
      </Button>
      <p className={classes.helperText}>OR</p>
      <h3 className={classes.secondaryHeading}>Join:</h3>
      <div className={classes.box}>
        <CustomInput
          label="Meeting-ID"
          placeholder="ID"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          lineColor="green"
        />
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleJoinMeeting}
        >
          Join
        </Button>
      </div>
      <div className={classes.nextContainer}>
        <Button
          color="error"
          variant="contained"
          size="large"
          onClick={nextStep}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Meeting;
