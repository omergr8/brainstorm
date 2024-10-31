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
  isValidJSON,
  calculateWordCounts,
} from "../../helper/helper";
import WordCountPieChart from "../../components/WordCountPieChart";
import { uploadDocumentApi } from "../../api/fileApi";
import { WEBSOCKET_URL } from "../../config/config";
// Styles
import classes from "./Home.module.css";

const Home = () => {
  const websocketRef = useRef(null);
  const { logout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState([]);
  const [analysis, setAnalysis] = useState({ titles: [], suggestions: [] });
  const [summary, setSummary] = useState([]);
  const [intensity, setIntensity] = useState(0);
  const [hidePlayer, setHidePlayer] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isMeetingEnd, setIsMeetingEnd] = useState(false);
  const [summaryLoader, setSummaryLoader] = useState(false);
  const [endLoader, setEndLoader] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [micPermission, setMicPermission] = useState(true);
  const [wordData, setWordData] = useState([]);

  // Set up the VAD
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

  //Cleanup
  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

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
    try {
      const responseMessage = await uploadDocumentApi(selectedFiles[0], id);
      toaster.success(responseMessage);
      console.log(responseMessage); // Display success message
    } catch (error) {
      toaster.error(`Error: ${error}`);
      console.log(`Error: ${error}`); // Display error message
    }
  };

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

  const handleConnectSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const meetingId = localStorage.getItem("meetingId");

    await handleDocumentUpload(meetingId);

    websocketRef.current = new WebSocket(
      `${WEBSOCKET_URL}/ws/audio/${meetingId}?token=${accessToken}&type=audio&meetingId=${meetingId}`
    );

    websocketRef.current.onopen = () => {
      toaster.success("WebSocket connected");
      console.log("WebSocket connected");
      setIsConnected(true); // Update state to indicate connection
    };

    websocketRef.current.onmessage = (event) => {
      console.log(event, event.data);

      // Check if event.data is valid JSON
      if (isValidJSON(event.data)) {
        const output = JSON.parse(event.data);
        console.log("output is : ", output);
        if (output.msg === "Authentication required: An error occurred.") {
          logout();
        }

        if (output && output.status === "success") {
          if (output.type === "transcription") {
            setTranscription((prev) => [
              ...prev,
              { text: output.text, user: output.user },
            ]);
          } else if (output.type === "analysis" && output.output) {
            setAnalysis((prevAnalysis) => ({
              titles: [...prevAnalysis.titles, ...output.output.titles],
              suggestions: [
                ...prevAnalysis.suggestions,
                ...output.output.suggestions,
              ],
            }));
          } else if (output.type === "summary") {
            setSummaryLoader(false);
            toaster.success("Summary Generated Successfully");
            setSummary(output.output);
          } else if (output.type === "end_meeting") {
            setEndLoader(false);
            setIsMeetingEnd(true);
            toaster.success(output.message);
          }
        }
      } else {
        // Handle non-JSON responses, e.g., errors or plain text messages
        setSummaryLoader(false);
        setEndLoader(false);
        toaster.error("Received non-JSON message");
        console.log("Received non-JSON message:", event.data);
      }
    };

    websocketRef.current.onerror = (event) => {
      toaster.error("WebSocket error:");
      console.error("WebSocket error:", event);
      setSummaryLoader(false);
      setEndLoader(false);
    };

    websocketRef.current.onclose = (event) => {
      toaster.info("WebSocket closed:");
      console.log("WebSocket closeds", event);
      setResetKey((prevKey) => prevKey + 1);
      resetStates();
    };
  };
  const disconnectWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close(); // Close WebSocket connection
    }
  };
  const handleEndMeeting = () => {
    if (
      websocketRef.current &&
      websocketRef.current.readyState === WebSocket.OPEN
    ) {
      setEndLoader(true);
      handleSummary();
      const endMeetingMessage = JSON.stringify({
        type: "end_meeting",
        meetingId: localStorage.getItem("meetingId"),
      });
      websocketRef.current.send(endMeetingMessage);
      console.log("End meeting message sent");
    }
  };

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
      {endLoader && <OverlayLoader />}
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
              <div>
                {/* {vad.loading
                  ? "Loading..."
                  : vad.userSpeaking
                  ? "User is speaking"
                  : "User is silent"} */}
              </div>
              {/* <Button
                variant="contained"
                color="error"
                onClick={disconnectWebSocket}
              >
                End Session
              </Button> */}
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
                <div className={classes.chartContent}>
                  <WordCountPieChart wordData={wordData} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <HeroSection
            handleConnect={handleConnectSession}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
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
