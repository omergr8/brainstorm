import React, { useEffect, useRef, useState } from "react";
import { useMicVAD } from "@ricky0123/vad-react";

const AudioStream = () => {
  const websocketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  function float32ToPCM(float32Array) {
    // Ensure proper scaling of Float32 values to Int16
    const pcmArray = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      // Scale to 16-bit range and clamp values
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcmArray[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return pcmArray;
  }

  function createWavFile(audioData) {  
    // Merge the header and audio data into a single buffer
    const wavBuffer = new Uint8Array(audioData.byteLength);
    wavBuffer.set(new Uint8Array(audioData.buffer), 0);
    return wavBuffer.buffer;
  }
  

  const vad = useMicVAD({
    startOnLoad: false,
    onSpeechStart: () => {
      console.log("User started talking");
    },
    onSpeechEnd: (audio) => {
      if (isConnected && websocketRef.current) {
        try {
          console.log("Processing audio data:", audio.length);
          const pcmData = float32ToPCM(audio);
          const wavBuffer = createWavFile(pcmData);
          console.log("WAV buffer size:", wavBuffer.byteLength);
          websocketRef.current.send(wavBuffer);
        } catch (error) {
          console.error("Error processing audio:", error);
        }
      }
    },
    onVADMisfire: () => {
      console.log("Speech misfire detected (too short)");
    },
  });

  const connectWebSocket = () => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    websocketRef.current = new WebSocket("ws://127.0.0.1:8000/api/audio");

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };

    websocketRef.current.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.transcription) {
          console.log("Transcription:", response.transcription);
        } else if (response.error) {
          console.error("Server error:", response.error);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
    };

    websocketRef.current.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
    };
  };

  const disconnectWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
      vad.pause();
      setIsConnected(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      vad.start();
    } else {
      vad.pause();
    }
  }, [isConnected, vad]);

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Voice Activity Detection</h1>
      <div className="mb-4">
        {vad.loading ? (
          "Loading..."
        ) : (
          <div className={`p-2 rounded ${vad.userSpeaking ? 'bg-green-100' : 'bg-gray-100'}`}>
            {vad.userSpeaking ? "User is speaking" : "User is silent"}
          </div>
        )}
      </div>
      {vad.errored && (
        <p className="text-red-500 mb-4">Error: {vad.errored.message}</p>
      )}
      <div className="space-x-4">
        <button
          onClick={connectWebSocket}
          disabled={isConnected}
          className={`px-4 py-2 rounded ${
            isConnected ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isConnected ? "Connected" : "Connect to WebSocket"}
        </button>
        <button
          onClick={disconnectWebSocket}
          disabled={!isConnected}
          className={`px-4 py-2 rounded ${
            !isConnected ? 'bg-gray-300' : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          Disconnect from WebSocket
        </button>
      </div>
    </div>
  );
};

export default AudioStream;