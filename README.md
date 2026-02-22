# Homepage

This is my homepage. It is built with Next.js and hosted at [salonenteemu.fi](https://salonenteemu.fi).

## Deployment and Dependencies

The website is deployed on Vercel and uses AWS DynamoDB as the database.

## Note

This project was created as a platform for learning full-stack web development and experimenting with new technologies. As such, it is a hobby project and is not actively maintained, so occasional issues may occur.

## Running the Application

Install the required dependencies with: `npm install`

Start the development server with: `npm run dev`

Open the application in a browser at: `http://localhost:3000/`

## Application Features

### Database Storage

- User details and chat forum posts are stored in AWS DynamoDB.

### User Authentication and Authorization

- **User Registration and Login**: Users can create an account and log in using their username or email.
- **JWT Authentication**: User sessions are managed with JSON Web Tokens (JWT).
- **Google reCAPTCHA**: Integrated into the registration form to help prevent bot signups.
- **User Profile Management**: Users can view, update, or delete their profile at any time.
- **Password Recovery**: After confirming their email address, users can request a password reset via email.

### Forum Page

The Forum page allows authenticated users to:

- Post new messages
- Reply to existing discussions
- Edit and delete their own posts
- Post up to 10 messages per day to reduce spam

### Projects Page

The Projects page showcases a selection of personal projects I have worked on and wanted to add to the website. Each project includes a brief description and a link to its respective GitHub repository.

#### ai-chess

A chess application where users can play against an AI opponent. The AI is powered by the minimax algorithm with alpha-beta pruning. Features include:

- Play as white or black
- Choose from three AI difficulty levels (easy, medium, hard)
- Undo moves and reset the game
- Sound effects for moves, captures, checkmate, and more

[ai-chess original GitHub repository](https://github.com/SalonenTeemu/ai-chess)

#### premier-league-app

An English Premier League application that displays:

- The league table of the current season
- All fixtures and match results

The application uses [football-data.org API](https://www.football-data.org/) to retrieve the data.

[premier-league-app original GitHub repository](https://github.com/SalonenTeemu/premier-league-app)

#### ai-chatbot

A simple AI chatbot built using the Google Gemini API (2.5 Flash model). Users can type messages and receive AI-generated responses. **Remember to not share any personal information with the chatbot.**

[ai-chatbot original GitHub repository](https://github.com/SalonenTeemu/ai-chatbot)

#### f1-app

A Formula 1 application displaying:

- The race schedule for the current season
- Driver and constructor standings
- Information on past and upcoming races

The application uses [jolpica-f1 API](https://github.com/jolpica/jolpica-f1?tab=readme-ov-file) to retrieve the data.

[f1-app original GitHub repository](https://github.com/SalonenTeemu/f1-app)
