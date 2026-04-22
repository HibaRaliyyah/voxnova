# VoxNova AI Voice Agent for Education

## Overview
The VoxNova AI Voice Agent for Education is an innovative project designed to enhance the educational experience using advanced voice recognition and processing technologies. This project aims to provide interactive and engaging learning tools that make education more accessible and enjoyable for students and educators alike.

## Features
- **Voice Recognition:** Seamless understanding of natural language to facilitate interactive conversations.
- **Personalized Learning:** Adapts to the individual learning pace and style of each student.
- **Multi-Platform Support:** Available on various platforms, including mobile devices and web applications.
- **API Integrations:** Integrates with popular educational platforms to enhance functionality and accessibility.
- **Custom Commands:** Allows educators to set up custom voice commands tailored to their specific needs.

## Technology Stack
- **Frontend:** React.js for building interactive user interfaces.
- **Backend:** Node.js and Express.js to handle server-side logic and API interactions.
- **Database:** MongoDB for storing user data and educational content.
- **Voice Recognition:** Utilizes Google Cloud Speech-to-Text and other AI models for voice processing.
- **Hosting:** Deployed on AWS for scalability and reliability.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/HibaRaliyyah/voxnova.git
   cd voxnova
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   MONGODB_URI=your_mongodb_uri
   GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
   ```
4. Start the application:
   ```bash
   npm start
   ```
5. Open your browser and navigate to `http://localhost:3000` to access the application.

## API Integrations
- **Google Classroom API:** To manage classroom resources and assignments.
- **Zoom API:** For integrating online classes and meetings.
- **Moodle API:** Allows the integration with the Moodle learning management system.

For any further information or support, please refer to the project's Wiki or contact the maintainers.