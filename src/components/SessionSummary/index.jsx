import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import classes from "./SessionSummary.module.css"; // Assuming modular CSS setup

const SessionSummary = ({ data, loading }) => {
  const {
    key_outcomes = [],
    decisions_made = [],
    action_items = [],
    overview = "Session Summary",
    important_takeaways = [],
  } = data;

  // Check if all key arrays and overview are empty
  const isDataEmpty =
    !key_outcomes.length &&
    !decisions_made.length &&
    !action_items.length &&
    !important_takeaways.length &&
    !overview;

  return (
    <div className={classes.container}>
      <Typography variant="h5" sx={{ fontWeight: "600" }} gutterBottom>
        Summary
      </Typography>
      {loading ? (
       <Box sx={{textAlign:'center'}}>
         <CircularProgress color="inherit" size="3rem"/>
       </Box>
      ) : (
        <Card
          className={classes.card}
          sx={{ background: "rgba(0,0,0,.55) !important" }}
        >
          <CardContent>
            {data.length === 0 ? (
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                Waiting for Summary...
              </Typography>
            ) : (
              <>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  Overview: {overview}
                </Typography>

                <Typography variant="h6" className={classes.sectionTitle}>
                  Key Outcomes
                </Typography>
                <List>
                  {key_outcomes.map((outcome, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={outcome} />
                    </ListItem>
                  ))}
                </List>

                <Divider className={classes.divider} />

                <Typography variant="h6" className={classes.sectionTitle}>
                  Decisions Made
                </Typography>
                <List>
                  {decisions_made.map((decision, index) => (
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
                  {action_items.map((action, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>

                <Divider className={classes.divider} />

                <Typography variant="h6" className={classes.sectionTitle}>
                  Important Takeaways
                </Typography>
                <List>
                  {important_takeaways.map((takeaway, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText primary={takeaway} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SessionSummary;
