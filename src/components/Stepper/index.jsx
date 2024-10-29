import React, { useState } from "react";

import Meeting from "./Meeting";
import DocumentUpload from "./DocumentUpload";
import SessionConnector from "./SessionConnector";

const Stepper = ({
  step,
  handleConnect,
  nextStep,
  prevStep,
  handleFileSelect,
  selectedFiles,
  handleCreateMeeting,
  handleJoinMeeting,
  meetingId,
  setMeetingId,
}) => {
  return (
    <>
      {(() => {
        switch (step) {
          case 1:
            return (
              <Meeting
                nextStep={nextStep}
                handleCreateMeeting={handleCreateMeeting}
                handleJoinMeeting={handleJoinMeeting}
                meetingId={meetingId}
                setMeetingId={setMeetingId}
              />
            );
          case 2:
            return (
              <DocumentUpload
                nextStep={nextStep}
                prevStep={prevStep}
                handleFileSelect={handleFileSelect}
                selectedFiles={selectedFiles}
              />
            );
          case 3:
            return (
              <SessionConnector
                prevStep={prevStep}
                handleConnect={handleConnect}
              />
            );
          default:
            return <div>Unknown step</div>;
        }
      })()}
    </>
  );
};

export default Stepper;
