import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

const LiveTranscript = () => {
  const [transcript, setTranscript] = useState('');

  useEffect(() => {
    const mockTranscript = [
      "Hello, this is the first part of the transcription.",
      "Now the second part comes in.",
      "More words keep getting transcribed as you speak.",
      "Finally, the last part of the mock transcription."
    ];

    let index = 0;
    const interval = setInterval(() => {
      setTranscript((prev) => prev + ' ' + mockTranscript[index]);
      index++;
      if (index >= mockTranscript.length) clearInterval(interval);
    }, 2000);

    return () => clearInterval(interval); // Clean up the interval
  }, []);

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Live Transcript
      </Typography>
      <Paper elevation={3} sx={{ p: 2, minHeight: 200 }}>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {transcript || 'Waiting for transcription...'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default LiveTranscript;
