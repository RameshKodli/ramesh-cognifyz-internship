# Cognifyz Technologies — Full Stack Development Internship

All 8 tasks, each in its own self-contained folder (per program instructions).
Every folder has its own `package.json` — install and run them independently.

| Folder | Level | Task |
|---|---|---|
| `level1-task1/` | 1: Beginner | HTML Structure and Basic Server Interaction |
| `level1-task2/` | 1: Beginner | Inline Styles, Basic Interaction, and Server-Side Validation |
| `level2-task3/` | 2: Intermediate | Advanced CSS Styling and Responsive Design |
| `level2-task4/` | 2: Intermediate | Complex Form Validation and Dynamic DOM Manipulation |
| `level3-task5/` | 3: Advanced | API Integration and Front-End Interaction |
| `level3-task6/` | 3: Advanced | Database Integration and User Authentication |
| `level4-task7/` | 4: Expert | Advanced API Usage and External API Integration |
| `level4-task8/` | 4: Expert | Advanced Server-Side Functionality |

## How to run any task

```bash
cd level1-task1         # or whichever task folder
npm install
npm start
```

Then open the printed `http://localhost:PORT` in your browser.

## Notes per task

- **Task 1 & 2**: No database needed. Task 1 uses EJS server-side rendering;
  Task 2 uses inline HTML/CSS/JS with server-side validation and temporary
  (in-memory) storage.
- **Task 3**: Pure static front-end (Bootstrap 5 + custom CSS transitions/animations).
- **Task 4**: Static front-end demonstrating dynamic DOM updates and a simple
  hash-based client-side router (`#/`, `#/tasks`, `#/password`).
- **Task 5**: A small in-memory "database" (array) exposed via a full REST
  (CRUD) API, consumed by the bundled front-end.
- **Task 6**: Requires MongoDB.
  1. `cp .env.example .env` and fill in `MONGODB_URI` (e.g. a local
     `mongodb://127.0.0.1:27017/cognifyz_task6` or a MongoDB Atlas URI) and a
     `JWT_SECRET`.
  2. `npm install && npm start`.
  3. Register/login from the UI; JWT-protected endpoints only return each
     user's own data.
- **Task 7**: Demonstrates an OAuth2 "client credentials" style token flow
  (`POST /oauth/token`), then uses that token to call a real external API
  (GitHub's public user API) through the server, with rate limiting
  (`express-rate-limit`) and centralized error handling.
  1. `cp .env.example .env` (defaults already match the front-end demo).
  2. `npm install && npm start`.
- **Task 8**: Shows request-processing middleware (body parsing + custom +
  `morgan` logging), a lightweight in-memory background job queue/worker
  (with comments on swapping in Redis/BullMQ for production), and a simple
  in-memory response cache with TTL (`X-Cache: HIT/MISS` header).

## Tech stack summary

Node.js, Express, EJS, vanilla JS/HTML/CSS, Bootstrap 5, MongoDB + Mongoose,
JWT (`jsonwebtoken`), `bcryptjs`, `express-rate-limit`, `morgan`.
