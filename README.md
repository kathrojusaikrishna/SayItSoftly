# Say it softly — React edition

A React + Vite rebuild of the original “Say it softly” concept, preserving its soft lavender palette, Spectral typography, paired glowing orbs, slow-scrolling story beats, and intimate closing interaction.

## Stack
- React 19 + Vite + React Router
- Express + Mongoose + MongoDB
- Web Crypto API: PBKDF2 (300,000 iterations, SHA-256) + AES-256-GCM
- HTML Audio API for each card's optional personalized MP3

## Features
- Create a message card and generate a unique 12-character ID
- Encrypt the complete card (message and optional MP3) in the browser
- Secret code is never sent to the server or stored
- Open a card with its ID and secret code
- Optional MP3 soundtrack, maximum 8 MB
- Responsive layout, dark mode, reduced-motion support
- Create-only card endpoint and basic rate limiting
- MongoDB TTL index expires cards after one year

## Requirements
- Node.js 18+
- MongoDB local instance or MongoDB Atlas

## Local development
1. Copy `.env.example` to `server/.env` and set `MONGODB_URI`.
2. Install root tooling: `npm install`
3. Install app dependencies: `npm install --prefix client && npm install --prefix server`
4. Run both apps: `npm run dev`
5. Open http://localhost:5173

Vite proxies `/api` requests to the Express server on port 3000.

## Production build
From the repository root:
```bash
npm install
npm install --prefix client
npm install --prefix server
npm run build
```

Set `NODE_ENV=production`, `MONGODB_URI`, and `PORT` in the hosting environment. Start the server with `npm start`. The Express app serves `client/dist` in production.

## Deploy on Render
Create a Node Web Service from this repository:
- Build command: `npm install && npm install --prefix client && npm install --prefix server && npm run build`
- Start command: `npm start`
- Environment variables:
  - `NODE_ENV=production`
  - `MONGODB_URI=<your MongoDB Atlas connection string>`

The service serves the React build and API from the same origin.

## Security and storage notes
- The browser encrypts the message and audio before upload. The server stores only ciphertext, salt, IV, and metadata.
- The recipient needs the card ID and secret code. Lost codes cannot be recovered.
- The optional MP3 is limited to 8 MB. Base64 encoding increases its size by roughly one third; the server JSON limit and ciphertext limit are configured accordingly.
- MongoDB documents have a 16 MB BSON size limit. The 8 MB audio limit leaves room for ciphertext and card text, but keep an eye on document size if the payload format changes.
- Use HTTPS in production. Rate limiting is basic; consider bot protection, monitoring, abuse reporting, and a tested deletion workflow before a public launch.
- Cards expire after one year through a MongoDB TTL index (TTL deletion is asynchronous, not immediate).
- This project does not implement user accounts or card editing. The API intentionally creates cards only; it does not permit overwriting an existing card ID.
