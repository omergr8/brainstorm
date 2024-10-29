import React, { useEffect, useRef, useState } from "react";
import { useMicVAD } from "@ricky0123/vad-react";
import { Button, Divider } from "@mui/material";
import { Typography } from "@mui/material";
import HeroSection from "../../components/HeroSection";
import LiveTranscript from "../../components/LiveTranscript";
import Suggestions from "../../components/Suggestions";
import SessionSummary from "../../components/SessionSummary";
import Idea from "../../components/Idea";
import { float32ToPCM } from "../../helper/helper";
import classes from "./Home.module.css";
import ActionFooter from "../../components/ActionFooter";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import withAuth from "../../providers/AuthProvider/withAuth";
import { isValidJSON } from "../../helper/helper";
import { uploadDocumentApi } from "../../api/fileApi";
import toaster from "../../components/Toast/Toast";

const Home = () => {
  const websocketRef = useRef(null);
  const { logout } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState([]);
  const [analysis, setAnalysis] = useState({ titles: [], suggestions: [] });
  const [summary, setSummary] = useState("");
  const [intensity, setIntensity] = useState(0);
  const [hidePlayer, setHidePlayer] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

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
      if (isConnected && websocketRef.current) {
        const pcmAudioBuffer = float32ToPCM(audio);

        // Send the PCM audio buffer to the server
        const blob = new Blob([pcmAudioBuffer], { type: "audio/wav" });
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          const base64Data = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
          );

           // Construct the JSON object
          const payload = {
            meetingId: localStorage.getItem("meetingId"), 
            data: base64Data,
            type: "audio"
          };

          // Send the payload as a JSON string
          websocketRef.current.send(JSON.stringify(payload));
        };
        reader.readAsArrayBuffer(blob);
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

  const handleConnectSession = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const meetingId = localStorage.getItem("meetingId");

    await handleDocumentUpload(meetingId);

    websocketRef.current = new WebSocket(
      `ws://127.0.0.1:8000/api/audio?token=${accessToken}&type=audio&meetingId=${meetingId}`
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
        console.log("output:", output);
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
          }
        }
      } else {
        // Handle non-JSON responses, e.g., errors or plain text messages
        toaster.error("Received non-JSON message");
        console.log("Received non-JSON message:", event.data);
      }
    };

    websocketRef.current.onerror = (event) => {
      toaster.error("WebSocket error:");
      console.error("WebSocket error:", event);
    };

    websocketRef.current.onclose = (event) => {
      toaster.info("WebSocket closed:");
      console.log("WebSocket closed", event);
      setIsConnected(false); // Update state when closed
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

      const endMeetingMessage = JSON.stringify({
          type: "end_meeting",
          meetingId: localStorage.getItem("meetingId"),
      });
      websocketRef.current.send(endMeetingMessage);
      console.log("End meeting message sent");
    }
  };

  // Effect to manage VAD start/stop based on connection state
  useEffect(() => {
    if (isConnected) {
      vad.start(); // Start VAD if connected
    } else {
      vad.pause(); // Stop VAD if not connected
    }
  }, [isConnected, vad]); // Dependencies to monitor changes

  useEffect(() => {
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const handleSummary = () => {
    console.log("api call for summary");
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
        {isConnected ? (
          <div>
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
              <Button
                variant="contained"
                color="error"
                onClick={disconnectWebSocket}
              >
                End Session
              </Button>
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
            <div className="text-center mt-10 mb-10">
              <Button onClick={handleSummary} variant="contained">
                Generate Summary
              </Button>
            </div>
            <div className={classes.commonBox}>
              <div className={classes.SessionSummary}>
                <SessionSummary data={summary} />
              </div>
            </div>
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
            <ActionFooter handleEnd={handleEndMeeting} intensity={intensity} />
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Home);
