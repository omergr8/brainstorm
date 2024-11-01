// websocketHelpers.js
import { isValidJSON } from "./helper";
import toaster from "../components/Toast/Toast";

export const connectWebSocket = (
  meetingId,
  accessToken,
  onOpen,
  onMessage,
  onError,
  onClose
) => {
  const websocket = new WebSocket(
    `${process.env.REACT_APP_WEBSOCKET_URL}/ws/audio/${meetingId}?token=${accessToken}&type=audio&meetingId=${meetingId}`
  );

  websocket.onopen = onOpen;
  websocket.onmessage = onMessage;
  websocket.onerror = onError;
  websocket.onclose = onClose;

  return websocket;
};

export const handleMessage = (
  event,
  setTranscription,
  setAnalysis,
  setSummary,
  setSummaryLoader,
  setEndLoader,
  logout,
  setIsMeetingEnd
) => {
  console.log(event, event.data);

  // Check if event.data is valid JSON
  if (isValidJSON(event.data)) {
    const output = JSON.parse(event.data);
    console.log("output is : ", output);
    if (output.msg === "Authentication required: An error occurred.") {
      logout();
    }

    if (output && output.status === "success") {
      switch (output.type) {
        case "transcription":
          setTranscription((prev) => [
            ...prev,
            { text: output.text, user: output.user },
          ]);
          break;
        case "analysis":
          if (output.output) {
            setAnalysis((prevAnalysis) => ({
              titles: [...prevAnalysis.titles, ...output.output.titles],
              suggestions: [
                ...prevAnalysis.suggestions,
                ...output.output.suggestions,
              ],
            }));
          }
          break;
        case "summary":
          setSummaryLoader(false);
          toaster.success("Summary Generated Successfully");
          setSummary(output.output);
          break;
        case "end_meeting":
          setEndLoader(false);
          setIsMeetingEnd(true);
          toaster.success(output.message);
          break;
        default:
          break;
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
