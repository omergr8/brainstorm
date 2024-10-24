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
  const [intensity, setIntensity] = useState(0);

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
    websocketRef.current = new WebSocket("ws://127.0.0.1:8000/api/audio?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYXVkYWhtZWQxNjMyQGdtYWlsLmNvbSIsImV4cCI6MTcyOTc4MDM1MH0.VlMw4a7LHc_kduB7kgrk-IMaV8fY2R-NQgVaZvrjZ1s");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true); // Update state to indicate connection
    };

    websocketRef.current.onmessage = (event) => {
      const output = JSON.parse(event.data);
      console.log('output')
      console.log(output);

      if (output && output.status === "success")  {
        if ( output.type === "transcription") {
          setTranscription((prev) => prev + " " + output.text);
        } else if (output.type === "titles") {
          console.log(output.titles)
        } else if (output.type === "summary") {
          console.log("Summary:", output.text);
        } else if (output.type === "ideas") {
          console.log("Ideas:", output.ideas);
        }
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
                <Suggestions />
              </div>
            </div>
            <div className={classes.commonBox}>
              <Idea />
            </div>
            <div className={classes.commonBox}>
              <div className={classes.SessionSummary}>
                <SessionSummary />
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
