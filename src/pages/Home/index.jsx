import React, { useEffect, useState } from "react";
import RecordButton from "../../components/RecordButton";
import LiveTranscript from "../../components/LiveTranscript";
import IdeaSuggestions from "../../components/IdeaSuggestions";
import SessionSummary from "../../components/SessionSummary";
import classes from "./Home.module.css";

const Home = () => {
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const handleRecordClick = () => {
    setIsSessionStarted(!isSessionStarted);
  };
  return (
    <div className={classes.main}>
      <div className="container">
        {/* <div className={classes.footer}>
          <div className={classes.footerContent}>
            <RecordButton
              isRecording={isSessionStarted}
              handleClick={handleRecordClick}
            />
          </div>
        </div> */}
        {isSessionStarted && (
          <div>
            <div>
              <LiveTranscript />
            </div>
            <div className={classes.box}>
            <div className={classes.IdeaSuggestions}>
              <IdeaSuggestions />
            </div>
            <div className={classes.SessionSummary}>
              <SessionSummary />
            </div>
            </div>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
