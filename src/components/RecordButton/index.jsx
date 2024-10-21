import React from 'react';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import classes from './RecordButton.module.css';

const RecordButton = ({ isRecording, handleClick }) => {
  return (
    <div
      className={isRecording ? classes.recording : classes.recordButton}
      onClick={handleClick}
    >
      {isRecording ? (
        <MicOffIcon className={classes.icon} />
      ) : (
        <MicIcon className={classes.icon} />
      )}
    </div>
  );
};

export default RecordButton;
