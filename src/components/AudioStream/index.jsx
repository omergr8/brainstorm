import React, { useEffect, useRef, useState } from "react";
import { useMicVAD } from "@ricky0123/vad-react";

const AudioStream = () => {
  const websocketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  function float32ToPCM(float32Array) {
    const pcmArray = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      // Convert Float32 to Int16
      pcmArray[i] = Math.max(-1, Math.min(1, float32Array[i])) * 32767; // Scale to PCM 16-bit
    }
    return pcmArray.buffer; // Return ArrayBuffer
  }

  // Set up the VAD
  const vad = useMicVAD({
    startOnLoad: false, // Disable automatic start
    onSpeechStart: () => {
      console.log("User started talking");
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
          console.log(arrayBuffer);
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

  const connectWebSocket = () => {
    websocketRef.current = new WebSocket("ws://127.0.0.1:8000/api/audio");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true); // Update state to indicate connection
    };

    websocketRef.current.onmessage = (event) => {
      console.log("Transcription:", event.data);
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
    <div>
      <h1>Voice Activity Detection</h1>
      <div>{vad.loading ? "Loading..." : vad.userSpeaking ? "User is speaking" : "User is silent"}</div>
      {vad.errored && <p>Error: {vad.errored.message}</p>}
      <button onClick={connectWebSocket} disabled={isConnected}>
        {isConnected ? "Connected" : "Connect to WebSocket"}
      </button>
      <button onClick={disconnectWebSocket} disabled={!isConnected}>
        Disconnect from WebSocket
      </button>
    </div>
  );
};

export default AudioStream;
