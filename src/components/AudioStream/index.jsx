import React, { useEffect, useRef, useState } from 'react';

const AudioStream = () => {
  const [isRecording, setIsRecording] = useState(false);
  const websocketRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    websocketRef.current = new WebSocket('ws://127.0.0.1:8000/api/audio'); 

    websocketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    websocketRef.current.onmessage = (event) => {
      console.log('Transcription:', event.data); 
    };

    websocketRef.current.onerror = (event) => {
        console.error('WebSocket error:', event);
    
        if (event instanceof Event) {
          console.error('Error type:', event.type);  
        } else {
          console.error('Unknown WebSocket error:', event);
        }
      

        console.log('WebSocket readyState:', websocketRef.current.readyState); 
      
    
      };

    websocketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.send(event.data);
        }
      };

      mediaRecorderRef.current.start(250); 
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div>
      <h1>Streaming</h1>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
    </div>
  );
};

export default AudioStream;
