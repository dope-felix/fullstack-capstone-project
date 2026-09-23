# GiftLink

GiftLink is a full-stack gift discovery app built with a Node.js/Express backend and a React frontend. The app allows users to browse gifts, search by category or age, and sign in/register with JWT-based authentication.

## Project structure

- `giftlink-backend/` — Express API and MongoDB logic
- `giftlink-frontend/` — React UI
- `sentiment/` — separate service for sentiment-related processing

## Tech stack

- Backend: Node.js, Express, MongoDB, JWT, bcryptjs
- Frontend: React, React Router, Bootstrap
- Logging: Pino
- Testing: Mocha + Chai

## Prerequisites

- Node.js 20.9+ (also required by the image optimizer)
- MongoDB running locally or a remote MongoDB connection
- A terminal for running the frontend and backend separately

## Backend setup

1. Open the backend folder:

```bash
cd giftlink-backend
```

2. Create a `.env` file in `giftlink-backend`.

3. Update `.env` with your MongoDB URL and JWT secret:

```env
MONGO_URL=mongodb://localhost:27017/giftdb
JWT_SECRET=your_secure_secret
PORT=3060
FRONTEND_URL=http://localhost:3000
```

Both the backend and frontend `.env` files are ignored by Git. Configure them
locally after cloning; do not commit credentials.

4. Install dependencies and run the server:

```bash
npm install
npm start
```

The API runs on `http://localhost:3060`.

## Frontend setup

1. Open the frontend folder:

```bash
cd giftlink-frontend
```

2. Create or update `giftlink-frontend/.env`:

```env
REACT_APP_BACKEND_URL=
API_PROXY_TARGET=http://127.0.0.1:3060
```

Leave `REACT_APP_BACKEND_URL` empty for local development and ngrok. The browser
requests `/api` on the frontend's own URL, and the development server forwards
those requests to `API_PROXY_TARGET`. If the backend uses a different port, update
that target. Restart the frontend after changing `.env` or `src/setupProxy.js`.

3. Install dependencies and start the UI:

```bash
npm install
npm start
```

The app runs on `http://localhost:3000`.

## Share the app with ngrok

Keep the backend (`3060`) and frontend (`3000`) running in separate terminals,
then run:

```bash
ngrok http 3000
```

Open the HTTPS forwarding URL shown by ngrok. One tunnel serves both the UI and
the API through the frontend proxy. Do not set `REACT_APP_BACKEND_URL` to
`localhost` or `127.0.0.1` when sharing the app: those addresses refer to the
visitor's device.

To check the connection, open `<your-ngrok-url>/api/gifts`; it should return a
JSON array of gifts. If ngrok reports `ERR_NGROK_8012`, confirm that the frontend
is running on port `3000`. If the frontend reports a proxy connection error,
confirm that the backend is running on port `3060` and MongoDB is available.

In Windows PowerShell, use `npm.cmd start` if `npm start` is blocked by the
script execution policy.

The development proxy only runs with `npm start`. For a deployed production
build, configure the hosting server to forward `/api` to the backend, or set
`REACT_APP_BACKEND_URL` to the public HTTPS API URL before building and set the
backend's `FRONTEND_URL` to the deployed frontend origin.

## Main features

- User registration and login
- JWT-based auth flow
- Gift listing
- Search by name, category, condition, and age filter
- User profile update flow
- Details page for individual gifts

## API overview

### Auth endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `PUT /api/auth/update`

### Gift endpoints

- `GET /api/gifts`
- `GET /api/gifts/:id`
- `POST /api/gifts`

### Search endpoint

- `GET /api/search?name=toy&category=Kitchen&condition=New&age_years=5`

## Notes

- The app is still a learning/demo project and can be improved further with stronger validation, production security hardening, and more complete test coverage.
- The code is intentionally documented with comments to make the structure easier to follow.

## Recommended next improvements

- Add a test suite for auth and profile routes
- Add protected route guards for authenticated screens
- Add rate limiting and helmet for Express security
- Add consistent API response formatting across routes
- Add CI/linting and deployment configuration
