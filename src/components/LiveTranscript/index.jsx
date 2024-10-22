import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import classes from "./LiveTranscript.module.css";

const LiveTranscript = ({ transcript }) => {
  return (
    <div className={classes.main}>
      <div className={classes.box}>
        <div className="container">
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {transcript && transcript !== ""
              ? transcript
              : "Waiting for transcription..."}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default LiveTranscript;
