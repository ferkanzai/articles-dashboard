# Articles Dashboard

A test web application for viewing/managing and summarizing articles, built with React, TypeScript, and Node.js.

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- TanStack Router for routing
- TanStack Query for state management
- TailwindCSS for styling
- Shadcn for accessible components
- Framer Motion for animations

### Backend
- Node.js with TypeScript
- Hono for API framework
- Drizzle ORM for database operations
- SQLite for data storage
- OpenAI API for article summarization (optional)

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v9.15.4 or higher)
- Docker and Docker Compose
- OpenAI API key (optional)

### Running the Application

1. Clone the repository:
```bash
git clone <repository-url>
cd articles-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory with:
```
OPENAI_API_KEY=your_api_key_here
DATABASE_URL=file:///data/articles.db
VITE_API_URL=http://localhost:3000/api
```

4. Start the application using Docker Compose:
```bash
docker-compose up --build -d
```

The application will be available at:
- Frontend: http://localhost:5173
- API: http://localhost:3000

### Development

To run the application in development mode:

1. Start the API:
```bash
cd api
pnpm dev
```

2. Start the frontend:
```bash
cd frontend
pnpm dev
```

### Bonus 🤩

The app is deployed and working [here]((https://edelman.fercarmona.dev/)) 🚀.

Also, as the API is built using OpenAPI, there's a web to check the schema properly so you can start working and testing right away. Check it out [here](https://edelman-api.fercarmona.dev/api/reference)

## Architecture Decisions

### Frontend Architecture
- Functional React components with hooks
- TanStack Query for efficient data fetching and caching
- Component-based architecture with reusable UI components
- Responsive design using TailwindCSS
- Type-safe routing with TanStack Router

### Backend Architecture
- RESTful API design using Hono framework
- Fully documented with an OpenAPI schema
- Type-safe API endpoints with Zod validation
- SQLite database with Drizzle ORM for data persistence
- OpenAI integration for article summarization (optional)
- Health checks and proper error handling

### Why SQLite?

I decided to go with SQLite as I wanted to use a SQL DB but I didn't want to go with an engine with more configurations, SQLite provides everything I wanted to have relations and needs nothing to work locally and a small Docker Image to work deployed.

### Why Hono and Node for the backend?

I know Python is the main language for the backend but as the assignment suggested to pick a preferred language/framework I decided to go with what I'm most comfortable with, which is Node. I decided I wanted to show how I work on the backend and that I'm able to write an API and if I'd have gone with Python/FastAPI I probably would've "wasted" more time learning and trying to make it as good as possible than actually building the API.

### Docker as a deployment tool

For me, is kind of a no brainer. I'm surely not the most experienced guy working with Docker, but when I'm building small apps for myself and I want to deploy them, I feel quite safe with Docker. It allows me to test the exact environment I want and build it to work everywhere. Also, I decided to use docker compose so I could build everything at once and can work "out of the box" with just one command. That's why I also decided to make the repository as a "monorepo" (although not using any specific tool as I though it was unnecessary for a project like this one).

## Some other notes

### Search functionality

I decided to go and build this as it wasn't really a difficult job with the set up I had. It was just a matter of extending the query in the backend and in the frontend it started to work "just like that" because of how the frontend is build and the work I did with query params and so on. It was a good one, although of course is not the best search engine but I took care of adding indexes for the DB fields I needed to query.

### Challenges

Probably the most challenging part was to work properly with the query params in the URL as a "state management" for the filters (although I think in the end it paid off!). And it was all because it was the first time for me working with TanStack Router and I was trying to make it more difficult that it was, with some useStates and a custom hook that was too convoluted. It was working but had some issues on edge cases. In the end, I decided to do a small refactor and work directly with the `useNavigate` API from TanStack Router and it works super nice! I'm happy about how it worked out.

### UI

For this, I want to say I used a bit of AI in order to help me as I'm not a good designer 😅. I used lovable for the Spotlight Cards and I also based the summarize button effect on a component I've found, although I changed it a little bit so it just affects text (it was for a full card).

### Summarization

I know the assignment said the summarize button should mock the summary, but we are on an AI world and I've tested OpenAI quite a lot for making text summaries (I have a small web app that summarizes YouTube videos), so I decided to give it a stretch and make the summarize button to actually summarize using AI. The good thing is if you don't really want to set up a OpenAI API Key, if you don't set it up in the `.env` file then you'll receive the mocked summary from the DB. Not bad!

### DB Seeding

When you are creating the app with docker compose, it creates the whole DB data and creates some mocked data (this was AI built, so it's a bit repetitive). It's good because you don't need to think about filling the DB and also because the app doesn't have that capability either.
