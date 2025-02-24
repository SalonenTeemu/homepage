# Homepage

This is my homepage. It's build with Next.js and hosted at [salonenteemu.fi](https://salonenteemu.fi).

## Application Deployment and Dependencies

The website is deployed on Vercel and uses AWS DynamoDB as the database option.

## Running the Application

Install the required dependencies with: `npm install`

Start the development server with: `npm run dev`

Open the application in a browser at: `http://localhost:3000/`

## Application Features

- **User Authentication**: Users can register an account and log in using their username or email. Authentication is handled via JWT for user sessions.
- **Google reCAPTCHA**: Implemented on the registration form to prevent bot signups.
- **Database Storage**: User details are stored in AWS DynamoDB.
- **User Profile**: Users can view and update their profile or delete their account.
- **Password Recovery**: After confirming their email address, users can request a password reset via email.

**Please note that the application currently lacks specific functionalities for logged-in users. However, I plan to add more features in the future, such as a forum where authenticated users can post and comment on other user's posts.**

### Projects Page

The projects page showcases some personal projects I have worked on and wanted to add to the website. Below are short descriptions and links to their original GitHub repositories.

#### ai-chess

A chess application where users can play against an AI opponent. The AI is powered by the minimax algorithm with alpha-beta pruning. Features include:

- Play as white or black
- Choose from three AI difficulty levels (easy, medium, hard)
- Undo moves and reset the game
- Sound effects for moves, captures, checkmate, etc.

[ai-chess original GitHub repository](https://github.com/SalonenTeemu/ai-chess)

#### ai-chatbot

A simple AI chatbot built using the Google Gemini API (1.5 Flash model). Users can type messages and receive AI-generated responses. **Remember to not give any personal information to the chatbot.**

[ai-chatbot original GitHub repository](https://github.com/SalonenTeemu/ai-chatbot)

#### premier-league-app

An English Premier League application that displays:

- The league table of the current season
- All fixtures and match results

The application uses [football-data.org API](https://www.football-data.org/) to retrieve the data.

[premier-league-app original GitHub repository](https://github.com/SalonenTeemu/premier-league-app)

#### f1-app

A Formula 1 application displaying:

- The race schedule for the current season
- Driver and constructor standings
- Information on past and upcoming races

The application uses [jolpica-f1 API](https://github.com/jolpica/jolpica-f1?tab=readme-ov-file) to retrieve the data.

[f1-app original GitHub repository](https://github.com/SalonenTeemu/f1-app)
