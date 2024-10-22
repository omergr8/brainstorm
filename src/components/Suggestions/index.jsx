import React from "react";
import { Card, CardContent, List, ListItem, ListItemText } from "@mui/material";

import classes from "./Suggestions.module.css"; // Assume we have a modular CSS setup

// Only keeping the 'suggestions' part of mockData
const mockData = [
  {
    suggestions: [
      "Enhance navigation by adding search functionality",
      "Implement a dark mode for better accessibility",
      "Add tooltips to guide new users",
    ],
  },
  {
    suggestions: [
      "Add data export functionality for analytics",
      "Integrate third-party apps via API",
      "Add custom report generation",
    ],
  },
  {
    suggestions: [
      "Use AI to recommend personalized content",
      "Allow users to customize their homepage",
      "Provide content based on user behavior analysis",
    ],
  },
];

const Suggestions = () => {
  // Flattening all suggestions into one array
  const allSuggestions = mockData.flatMap((data) => data.suggestions);

  return (
    <div className={classes.main}>
      <div className={classes.box}>
        <div className="container">
          <List>
            {allSuggestions.map((suggestion, idx) => (
              <ListItem key={idx} disablePadding>
                <ListItemText primary={`${idx + 1}. ${suggestion}`} />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
