# Brainstorm

Brainstorm is an interactive brainstorming session application built with React. It allows users to engage in collaborative discussions, upload documents, and visualize data through various charts.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Project](#running-the-project)
- [Scripts](#scripts)
- [Dependencies](#dependencies)

## Features

- Real-time collaboration with WebSocket support.
- Document upload capabilities.
- Visualization of word counts and idea relationships through charts.
- Detailed summaries and key takeaways generated from the session.

## Technologies Used

- React: For building the user interface.
- Material UI: For responsive design and UI components.
- Chart.js: For rendering charts and graphs.
- Axios: For making HTTP requests.
- React Toastify: For toast notifications.
- Voice Activity Detection: Using `@ricky0123/vad-react` and `@ricky0123/vad-web` for real-time audio processing.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository to your local machine:

   git clone https://github.com/omergr8/brainstorm.git
   cd brainstorm

2. npm install.

## Configuration

Before running the project, set up your environment variables. Create a .env file in the root directory and add the following lines:
REACT_APP_WEBSOCKET_URL="websocket_URL"
REACT_APP_BASE_URL="server_base_URL"

## Running the Project

npm start

## Scripts

The following scripts are available for managing the project:

start: Runs the app in development mode.
build: Builds the app for production to the build folder.
test: Runs the test suite.
eject: Removes the single build dependency from your project (use with caution).

## Dependencies

This project is built using the following key dependencies:

@mui/material and @mui/icons-material: Material UI for styling and components.
react-chartjs-2 and chart.js: For data visualization with charts.
axios: For making HTTP requests.
react-toastify: For displaying toast notifications.
@ricky0123/vad-react and @ricky0123/vad-web: For voice activity detection.
For a complete list of dependencies, refer to the package.json file.




  

