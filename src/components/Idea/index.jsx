import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import classes from "./Idea.module.css"; // Assume we have a modular CSS setup

const mockData = [
  {
    idea: "Idea 1: Improve User Experience",
    category: "UX",
    votes: 5,
  },
  {
    idea: "Idea 2: New Features for Dashboard",
    category: "Features",
    votes: 3,
  },
  {
    idea: "Idea 3: Content Personalization",
    category: "AI",
    votes: 7,
  },
  {
    idea: "Idea 4: Content Personalization",
    category: "AI",
    votes: 7,
  },
  {
    idea: "Idea 5: Content Personalization",
    category: "AI",
    votes: 7,
  },
  {
    idea: "Idea 6: Content Personalization",
    category: "AI",
    votes: 7,
  },
];

const Idea = ({ data = [] }) => {
  const [ideas, setIdeas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(()=>{
    if (data.length>0){
      setIdeas(data)
    }
    console.log("test", data)
  },[data])


  const handleVote = (index, type) => {
    const updatedIdeas = [...ideas];
    if (type === "upvote") {
      updatedIdeas[index].votes += 1;
    } else {
      updatedIdeas[index].votes -= 1;
    }
    setIdeas(updatedIdeas);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const categories = [
    "All",
    ...new Set(data.map((item) => item.category).filter(Boolean)),
  ];

  const filteredIdeas =
    selectedCategory === "All"
      ? ideas
      : ideas.filter((idea) => idea.category === selectedCategory);

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography variant="h5" sx={{ fontWeight: "600" }} gutterBottom>
          Idea Organization
        </Typography>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={classes.select}
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.cardsCarousel}>
        {ideas && ideas.length > 0 ? (
          filteredIdeas.map((data, index) => (
            <div className={classes.card} key={index}>
              <div className="container">
                <div className={classes.content}>
                  <h2 className={classes.heading}>{data.title}</h2>
                  <div className={classes.ideaSection}>
                    <Typography variant="p" sx={{ fontWeight: "500" }}>
                      {data.idea}
                    </Typography>
                    {/* <div className={classes.voteSection}>
                    <IconButton onClick={() => handleVote(0, "upvote")}>
                      <ThumbUpIcon />
                    </IconButton>
                    <Typography variant="body1">{data.votes}</Typography>
                    <IconButton onClick={() => handleVote(1, "downvote")}>
                      <ThumbDownIcon />
                    </IconButton>
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            Waiting for Ideas...
          </Typography>
        )}
      </div>
    </div>
  );
};

export default Idea;
