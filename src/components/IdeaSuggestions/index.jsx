import React, { useState } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, IconButton, Select, MenuItem } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import classes from './Suggestions.module.css';  // Assume we have a modular CSS setup

const mockData = [
  {
    idea: 'Idea 1: Improve User Experience',
    category: 'UX',
    suggestions: [
      'Enhance navigation by adding search functionality',
      'Implement a dark mode for better accessibility',
      'Add tooltips to guide new users',
    ],
    votes: 5,
  },
  {
    idea: 'Idea 2: New Features for Dashboard',
    category: 'Features',
    suggestions: [
      'Add data export functionality for analytics',
      'Integrate third-party apps via API',
      'Add custom report generation',
    ],
    votes: 3,
  },
  {
    idea: 'Idea 3: Content Personalization',
    category: 'AI',
    suggestions: [
      'Use AI to recommend personalized content',
      'Allow users to customize their homepage',
      'Provide content based on user behavior analysis',
    ],
    votes: 7,
  },
];

const IdeaSuggestions = () => {
  const [ideas, setIdeas] = useState(mockData);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleVote = (index, type) => {
    const updatedIdeas = [...ideas];
    if (type === 'upvote') {
      updatedIdeas[index].votes += 1;
    } else {
      updatedIdeas[index].votes -= 1;
    }
    setIdeas(updatedIdeas);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredIdeas = selectedCategory === 'All'
    ? ideas
    : ideas.filter((idea) => idea.category === selectedCategory);

  return (
    <div className={classes.container}>
      <Select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className={classes.select}
      >
        <MenuItem value="All">All Categories</MenuItem>
        <MenuItem value="UX">UX</MenuItem>
        <MenuItem value="Features">Features</MenuItem>
        <MenuItem value="AI">AI</MenuItem>
      </Select>

      {filteredIdeas.map((data, index) => (
        <Card key={index} className={classes.card}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {data.idea} ({data.category})
            </Typography>

            <div className={classes.voteSection}>
              <IconButton onClick={() => handleVote(index, 'upvote')}>
                <ThumbUpIcon />
              </IconButton>
              <Typography variant="body1">{data.votes}</Typography>
              <IconButton onClick={() => handleVote(index, 'downvote')}>
                <ThumbDownIcon />
              </IconButton>
            </div>

            <List>
              {data.suggestions.map((suggestion, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText primary={suggestion} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default IdeaSuggestions;
