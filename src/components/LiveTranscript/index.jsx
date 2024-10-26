import React from "react";
import { Typography } from "@mui/material";
import classes from "./LiveTranscript.module.css";

const LiveTranscript = ({ transcript }) => {
  return (
    <div className={classes.main}>
      <div className={classes.box}>
        {transcript && transcript.length > 0 ? (
          transcript.map((el, i) => (
            <div key={i} className={classes.message}>
              <span className={classes.user}>{el.user}:</span>
              <span className={classes.text}>{el.text}</span>
            </div>
          ))
        ) : (
          <Typography variant="body1" className={classes.placeholder}>
            Waiting for transcription...
          </Typography>
        )}
      </div>
    </div>
  );
};

export default LiveTranscript;
