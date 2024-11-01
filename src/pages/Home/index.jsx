// React and Core Library Imports
import React, { useEffect, useRef, useState } from "react";
// Third-party Library Imports
import { useMicVAD } from "@ricky0123/vad-react";
import { Button, Divider, Typography } from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
// Context and Providers
import { useAuth } from "../../context/AuthContext";
import withAuth from "../../providers/AuthProvider/withAuth";
// Component Imports
import HeroSection from "../../components/HeroSection";
import LiveTranscript from "../../components/LiveTranscript";
import Suggestions from "../../components/Suggestions";
import SessionSummary from "../../components/SessionSummary";
import Idea from "../../components/Idea";
import ActionFooter from "../../components/ActionFooter";
import OverlayLoader from "../../components/OverlayLoader";
import toaster from "../../components/Toast/Toast";
import IdeaRelationshipChart from "../../components/IdeaRelationshipChart";
import RecordButton from "../../components/RecordButton";
// Helper Functions
import {
  float32ToPCM,
  calculateWordCounts,
} from "../../helper/helper";
import { connectWebSocket, handleMessage } from "../../helper/websocketHelpers";
import WordCountPieChart from "../../components/WordCountPieChart";
import KeyOutcomesChart from "../../components/KeyOutcomesChart";
import DecisionsMadeChart from "../../components/DecisionsMadeChart";
import { uploadDocumentApi } from "../../api/fileApi";
// Styles
import classes from "./Home.module.css";

const Home = () => {
  // References
  const websocketRef = useRef(null);

  // Hooks
  const { logout } = useAuth();

  // Connection States
  const [isConnected, setIsConnected] = useState(false);
  const [isMeetingEnd, setIsMeetingEnd] = useState(false);

  // Transcription & Analysis States
  const [transcription, setTranscription] = useState([]);
  const [analysis, setAnalysis] = useState({ titles: [], suggestions: [] });
  const [summary, setSummary] = useState([]);
  const [wordData, setWordData] = useState([]);

  // UI States
  const [hidePlayer, setHidePlayer] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loadinText, setLoadingText] = useState(null);
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [endLoader, setEndLoader] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  // Audio & Interaction States
  const [micPermission, setMicPermission] = useState(true);
  const [intensity, setIntensity] = useState(0);

  // Set up the Voice Activity Detection (VAD)
  const vad = useMicVAD({
    startOnLoad: false, // Disable automatic start
    onSpeechStart: () => {
      console.log("User started talking");
    },
    onFrameProcessed: (probabilities) => {
      const { isSpeech } = probabilities;
      // You can scale the isSpeech value to get an intensity level
      setIntensity(isSpeech);
    },
    onSpeechEnd: (audio) => {
      // Only send audio if connected and VAD is enabled
      console.log(websocketRef.current);
      if (
        isConnected &&
        websocketRef.current &&
        !isMeetingEnd &&
        micPermission
      ) {
        const pcmAudioBuffer = float32ToPCM(audio);

        // Send the PCM audio buffer to the server
        const blob = new Blob([pcmAudioBuffer], { type: "audio/wav" });
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const base64Data = btoa(
            new Uint8Array(arrayBuffer).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          );

          // Construct the JSON object
          const payload = {
            meetingId: localStorage.getItem("meetingId"),
            data: base64Data,
            type: "audio",
          };

          // Send the payload as a JSON string
          websocketRef.current.send(JSON.stringify(payload));
        };
        reader.readAsArrayBuffer(blob);
      } else if (isMeetingEnd) {
        toaster.error("Meeting has ended.");
      } else {
        toaster.error("WebSocket is not connected.");
        console.log("WebSocket is not connected.");
      }
    },
    onVADMisfire: () => {
      toaster.error("Speech misfire detected (too short)");
      console.log("Speech misfire detected (too short)");
    },
  });

  // Effect to manage VAD start/stop based on connection state
  useEffect(() => {
    if (isConnected && !isMeetingEnd && micPermission) {
      vad.start(); // Start VAD if connected
    } else {
      vad.pause(); // Stop VAD if not connected
    }
  }, [isConnected, vad, isMeetingEnd, micPermission]); // Dependencies to monitor changes

  // Cleanup effect to close WebSocket connection on component unmount
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  // Function to handle document upload
  const handleDocumentUpload = async (id) => {
    if (!selectedFiles[0]) {
      toaster.error("Please select a file first.");
      console.log("Please select a file first.");
      return;
    }
    if (!id) {
      toaster.error("no meeting id is detected");
      console.log("no meeting id is detected");
      return;
    }
    setEndLoader(true);
    setLoadingText("Uploading File, Please wait!");
    try {
      const responseMessage = await uploadDocumentApi(selectedFiles[0], id);
      toaster.success(responseMessage);
      console.log(responseMessage); // Display success message
    } catch (error) {
      toaster.error(`Error: ${error}`);
      console.log(`Error: ${error}`); // Display error message
    } finally {
      setEndLoader(false);
      setLoadingText(null);
    }
  };

  // Function to reset application states
  const resetStates = () => {
    setIsConnected(false);
    setTranscription([]);
    setAnalysis({ titles: [], suggestions: [] });
    setSummary([]);
    setIntensity(0);
    setHidePlayer(false);
    setSelectedFiles([]);
    setIsMeetingEnd(false);
    setSummaryLoader(false);
    setEndLoader(false);
    setMicPermission(true);
  };

  // Function to handle connecting to the session
  const handleConnectSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const meetingId = localStorage.getItem("meetingId");

    await handleDocumentUpload(meetingId);
    setEndLoader(true);
    setLoadingText("Connecting...");

    const onOpen = () => {
      toaster.success("WebSocket connected");
      console.log("WebSocket connected");
      setEndLoader(false);
      setIsConnected(true);
    };

    const onMessage = (event) => {
      handleMessage(
        event,
        setTranscription,
        setAnalysis,
        setSummary,
        setSummaryLoader,
        setEndLoader,
        logout,
        setIsMeetingEnd
      );
    };

    const onError = (event) => {
      toaster.error("WebSocket error:");
      console.error("WebSocket error:", event);
      setSummaryLoader(false);
      setEndLoader(false);
    };

    const onClose = (event) => {
      toaster.info("WebSocket closed:");
      console.log("WebSocket closed", event);
      setResetKey((prevKey) => prevKey + 1);
      resetStates();
    };

    websocketRef.current = connectWebSocket(
      meetingId,
      accessToken,
      onOpen,
      onMessage,
      onError,
      onClose
    );
  };

  const disconnectWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close(); // Close WebSocket connection
    }
  };

  // Function to handle EndMeeting
  const handleEndMeeting = () => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      setEndLoader(true);
      setLoadingText("Creating Summary");
      handleSummary();
      const endMeetingMessage = JSON.stringify({
        type: "end_meeting",
        meetingId: localStorage.getItem("meetingId"),
      });
      websocketRef.current.send(endMeetingMessage);
      console.log("End meeting message sent");
    }
  };

  // Function to generate summary
  const handleSummary = () => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      setSummaryLoader(true);
      const genSummaryMessage = JSON.stringify({
        type: "generate_summary",
        meetingId: localStorage.getItem("meetingId"),
      });
      websocketRef.current.send(genSummaryMessage);
      console.log("Generate Summary sent");
    }
  };

  useEffect(() => {
    if (transcription.length > 0) {
      const dt = calculateWordCounts(transcription);
      setWordData(dt);
    }
  }, [transcription]);

  return (
    <div className={classes.main} key={resetKey}>
      {endLoader && <OverlayLoader text={loadinText} />}
      <div className="container">
        {isConnected ? (
          <div>
            <div className={classes.footer}>
              <div className={classes.footerContent}>
                <RecordButton
                  isRecording={micPermission}
                  handleClick={() => setMicPermission(!micPermission)}
                />
              </div>
            </div>
            <div className={classes.disconnectBox}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "600" }}
              >
                Session Dashboard
              </Typography>
              <div></div>
            </div>
            <Divider />
            {vad.errored && <p>Error: {vad.errored.message}</p>}
            <div className={classes.box}>
              <div className={classes.IdeaSuggestions}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ textAlign: "center", fontWeight: "600" }}
                >
                  Live Transcript
                </Typography>
                <LiveTranscript transcript={transcription} />
              </div>
              <div className={classes.IdeaSuggestions}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ textAlign: "center", fontWeight: "600" }}
                >
                  AI Suggestion
                </Typography>
                <Suggestions data={analysis.suggestions} />
              </div>
            </div>
            <div className={classes.commonBox}>
              <Idea data={analysis.titles} />
            </div>
            {analysis.titles.length > 0 && (
              <div className={classes.chartContainer}>
                <div className={classes.chartContent}>
                  <IdeaRelationshipChart data={analysis} />
                </div>
              </div>
            )}

            <div className="text-center mt-10 mb-10">
              <Button
                onClick={handleSummary}
                variant="contained"
                disabled={isMeetingEnd}
              >
                Generate Summary
              </Button>
            </div>
            <div className={classes.commonBox}>
              <div className={classes.SessionSummary}>
                <SessionSummary data={summary} loading={summaryLoader} />
              </div>
            </div>
            {isMeetingEnd && wordData.length > 0 && (
              <div className={classes.commonBox}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ textAlign: "left", fontWeight: "600" }}
                >
                  Report
                </Typography>
                <div className={classes.chartBox}>
                  <div className={classes.chartContent}>
                    <WordCountPieChart wordData={wordData} />
                  </div>
                  {summary && summary.key_outcomes && summary.action_items && (
                    <div className={classes.chartContent}>
                      <KeyOutcomesChart
                        keyOutcomes={summary.key_outcomes}
                        actionItems={summary.action_items}
                      />
                    </div>
                  )}
                </div>

                {summary && summary.decisions_made && (
                  <div className={classes.chartContent}>
                    <DecisionsMadeChart
                      decisionsMade={summary.decisions_made}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <HeroSection
            handleConnect={handleConnectSession}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            setLoader={setEndLoader}
            setLoadingText={setLoadingText}
          />
        )}
      </div>
      {isConnected && (
        <div
          className={`${classes.playerContainer} ${
            hidePlayer ? classes.hide : classes.show
          }`}
        >
          <div className={classes.toggleButtonContainer}>
            <div
              className={classes.toggleButton}
              onClick={() => setHidePlayer(!hidePlayer)}
            >
              {hidePlayer ? (
                <KeyboardArrowUp fontSize="large" />
              ) : (
                <KeyboardArrowDown fontSize="large" />
              )}
            </div>
          </div>
          <div className={classes.test}>
            <ActionFooter
              handleEnd={handleEndMeeting}
              isEnd={isMeetingEnd}
              intensity={intensity}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Home);
