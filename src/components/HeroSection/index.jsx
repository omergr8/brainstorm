import React, { useState } from "react";
import Stepper from "../Stepper";
import AuthBox from "../AuthBox";
import { createMeetingApi } from "../../api/meetingApi";
import classes from "./HeroSection.module.css";
import toaster from "../Toast/Toast";

const HeroSection = ({ handleConnect, selectedFiles, setSelectedFiles }) => {
  const [step, setStep] = useState(1);
  const [meetingId, setMeetingId] = useState("");
  const [isMeetingJoined, setIsMeetingJoined] = useState(false);
  const [error, setError] = useState(null);

  const conditions = {
    1: () => {
      if (isMeetingJoined) return true;
    },
    2: () => {
      if (selectedFiles.length > 0) return true;
    },
    3: () => {
      return true;
    },
  };

  const handleCreateMeeting = async () => {
    try {
      setError(null); // Reset any previous errors
      const response = await createMeetingApi({ title: "New Meeting" });
      setIsMeetingJoined(true);
      setMeetingId(response.meetingId); // Assuming the response contains `meetingId`
      localStorage.setItem("meetingId", response.meetingId);
      toaster.success(`Meeting created successfully: ${response.meetingId}`);
      console.log(`Meeting created successfully: ${response.meetingId}`);
    } catch (err) {
      toaster.error("Failed to create the meeting. Please try again.");
      console.error("Create Meeting Error:", err);
    }
  };
  const handleJoinMeeting = () => {};

  const handleFileSelect = (files) => {
    setSelectedFiles(files);
  };

  const nextStep = () => {
    // Check the condition for the current step
    if (conditions[step] && conditions[step]()) {
      setStep(step + 1); // Proceed to next step if condition is met
    } else {
      // Display error or alert if condition fails
      toaster.error(`Please complete all required fields in Step ${step}`);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  return (
    <div className={classes.main}>
      <h2 className={classes.heading}>
        Welcome to Interactive Brainstorming Session Manager
      </h2>
      <AuthBox>
        <Stepper
          step={step}
          handleConnect={handleConnect}
          handleCreateMeeting={handleCreateMeeting}
          handleJoinMeeting={handleJoinMeeting}
          nextStep={nextStep}
          prevStep={prevStep}
          handleFileSelect={handleFileSelect}
          selectedFiles={selectedFiles}
          meetingId={meetingId}
          setMeetingId={setMeetingId}
        />
      </AuthBox>
    </div>
  );
};

export default HeroSection;
