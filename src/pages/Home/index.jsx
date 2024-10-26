import React, { useEffect, useRef, useState } from "react";
import { useMicVAD } from "@ricky0123/vad-react";
import RecordButton from "../../components/RecordButton";
import { Button, Divider } from "@mui/material";
import { Typography } from "@mui/material";
import HeroSection from "../../components/HeroSection";
import LiveTranscript from "../../components/LiveTranscript";
import Suggestions from "../../components/Suggestions";
import SessionSummary from "../../components/SessionSummary";
import Idea from "../../components/Idea";
import { float32ToPCM } from "../../helper/helper";
import classes from "./Home.module.css";
import Waveform from "../../components/Wave";

const Home = () => {
  const websocketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [analysis, setAnalysis] = useState({ titles: [], suggestions: [] });
  const [summary, setSummary] = useState("");
  const [intensity, setIntensity] = useState(0);

  const isValidJSON = (data) => {
    try {
      JSON.parse(data);
      return true;
    } catch (error) {
      return false;
    }
  };

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
          // Send arrayBuffer to your backend WebSocket
          websocketRef.current.send(arrayBuffer);
        };
        reader.readAsArrayBuffer(blob);
      } else {
        console.log("WebSocket is not connected.");
      }
    },
    onVADMisfire: () => {
      console.log("Speech misfire detected (too short)");
    },
  });

  const handleConnectSession = () => {
    const accessToken = localStorage.getItem("accessToken");

    websocketRef.current = new WebSocket(
      `ws://127.0.0.1:8000/api/audio?token=${accessToken}`
    );

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true); // Update state to indicate connection
    };

    websocketRef.current.onmessage = (event) => {
      console.log(event, event.data);

      // Check if event.data is valid JSON
      if (isValidJSON(event.data)) {
        const output = JSON.parse(event.data);
        console.log("output:", output);

        if (output && output.status === "success") {
          if (output.type === "transcription") {
            setTranscription((prev) => prev + " " + output.text);
          } else if (output.type === "analysis" && output.output) {
            setAnalysis((prevAnalysis) => ({
              titles: [...prevAnalysis.titles, ...output.output.titles],
              suggestions: [
                ...prevAnalysis.suggestions,
                ...output.output.suggestions,
              ],
            }));
          }
          //  else if (output.type === "titles") {
          //   console.log("Titles:", output.titles);
          // } else if (output.type === "summary") {
          //   console.log("Summary:", output.text);
          // } else if (output.type === "ideas") {
          //   console.log("Ideas:", output.ideas);
          // }
        }
      } else {
        // Handle non-JSON responses, e.g., errors or plain text messages
        console.log("Received non-JSON message:", event.data);
      }
    };

    websocketRef.current.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false); // Update state when closed
    };
  };
  const disconnectWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close(); // Close WebSocket connection
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
                <Waveform intensity={intensity} />
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
              <Button onClick={handleSummary} variant="contained">Generate Summary</Button>
            </div>
            <div className={classes.commonBox}>
              <div className={classes.SessionSummary}>
                <SessionSummary data={summary}/>
              </div>
            </div>
          </div>
        ) : (
          <HeroSection handleConnect={handleConnectSession} />
        )}
      </div>
    </div>
  );
};

export default Home;
