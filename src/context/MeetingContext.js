import React, { createContext, useState, useContext } from 'react';

const MeetingContext = createContext();

export const MeetingProvider = ({ children }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [meetingId, setMeetingId] = useState('');
  
  const handleConnectSession = () => {
    // Define the session connection logic
  };
  
  const handleCreateMeeting = () => {
    // Define the meeting creation logic
  };

  return (
    <MeetingContext.Provider value={{ handleConnectSession, selectedFiles, setSelectedFiles, handleCreateMeeting, meetingId, setMeetingId }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => useContext(MeetingContext);
