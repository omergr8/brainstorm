import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import classes from "./SessionSummary.module.css"; // Assuming modular CSS setup

const mockSummaryData = {
  sessionTitle: "Brainstorming Session: New Features for Product X",
  keyIdeas: [
    "Implement dark mode for better user experience",
    "Allow custom dashboard layouts",
    "Integrate AI-driven content recommendations",
  ],
  decisions: [
    "Proceed with dark mode implementation in Q1",
    "Research AI recommendation systems for Q2",
    "Create mockups for custom dashboard feature",
  ],
  actionItems: [
    "Assign dark mode feature to UX design team",
    "Schedule a meeting to discuss AI integration feasibility",
    "Prepare wireframes for custom dashboard layouts",
  ],
};

const SessionSummary = ({ data }) => {
  const { sessionTitle, keyIdeas, decisions, actionItems } = mockSummaryData;

  return (
    <div className={classes.container}>
      <Typography variant="h5" sx={{ fontWeight: "600" }} gutterBottom>
        Summary
      </Typography>
      <Card className={classes.card}>
        <CardContent>
          {data && data !== "" ? (
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {data}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              Waiting for Summary...
            </Typography>
          )}
          {/* <Typography variant="h5" gutterBottom>
            {sessionTitle}
          </Typography>
          
          <Typography variant="h6" className={classes.sectionTitle}>
            Key Ideas
          </Typography>
          <List>
            {keyIdeas.map((idea, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={idea} />
              </ListItem>
            ))}
          </List>

          <Divider className={classes.divider} />

          <Typography variant="h6" className={classes.sectionTitle}>
            Decisions
          </Typography>
          <List>
            {decisions.map((decision, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={decision} />
              </ListItem>
            ))}
          </List>

          <Divider className={classes.divider} />

          <Typography variant="h6" className={classes.sectionTitle}>
            Action Items
          </Typography>
          <List>
            {actionItems.map((action, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={action} />
              </ListItem>
            ))}
          </List> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionSummary;
