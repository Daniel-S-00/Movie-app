# Movie App

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://movie-app-one-theta-77.vercel.app/)
[![CI](https://github.com/Daniel-S-00/Movie-app/actions/workflows/ci.yml/badge.svg)](https://github.com/Daniel-S-00/Movie-app/actions/workflows/ci.yml)
![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite 7](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

A modern movie discovery app built with React, Vite, and Tailwind CSS. Search for movies, browse trending searches, and explore a curated catalog powered by [TMDB](https://www.themoviedb.org/).

![Hero](./docs/screenshots/hero.png)
![Movies grid](./docs/screenshots/movies.png)

## Live Demo

**https://movie-app-one-theta-77.vercel.app/**

## Features

- Real-time search with debounced input (500ms)
- Popular movies discovery from TMDB
- Trending searches tracked via Appwrite
- Fully responsive layout
- Fast — Vite + React 19
- Modern dark UI with Tailwind CSS v4

## Tech Stack

**Frontend**
- [React 19](https://react.dev/) — UI library
- [Vite 7](https://vite.dev/) — Build tool & dev server
- [Tailwind CSS 4](https://tailwindcss.com/) — Utility-first styling
- [react-use](https://github.com/streamich/react-use) — `useDebounce` hook

**APIs & Services**
- [TMDB API](https://www.themoviedb.org/documentation/api) — Movie data
- [Appwrite](https://appwrite.io/) — Backend-as-a-Service for search metrics

**Tooling & Deployment**
- ESLint 9 (flat config)
- Vercel — hosting & CI/CD

## Project Structure

```
src/
├── App.jsx              # Main app component (state, effects, layout)
├── appwrite.js          # Appwrite service (search tracking)
├── main.jsx             # Entry point
├── index.css            # Global styles + Tailwind theme tokens
└── components/
    ├── MovieCard.jsx    # Movie card UI
    ├── Search.jsx       # Debounced search input
    └── Spinner.jsx      # Loading spinner
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A free [TMDB](https://www.themoviedb.org/signup) account (for the movie API)
- A free [Appwrite Cloud](https://cloud.appwrite.io/) project (for trending searches)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/movie-app.git
cd movie-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

See [`.env.example`](./.env.example) for all required variables.

#### Getting a TMDB API Key

1. Create an account at [themoviedb.org](https://www.themoviedb.org/signup)
2. Go to **Settings → API**
3. Copy your **API Read Access Token** (v4 auth — a long JWT string)
4. Paste it as `VITE_TMDB_API_KEY` in `.env.local`

> The TMDB Read Access Token is read-only and safe to ship to the client.

#### Setting up Appwrite

1. Create a project in the [Appwrite Console](https://cloud.appwrite.io/)
2. Create a database and a collection (e.g. `metrics`)
3. Add the following attributes to the collection:
   - `searchTerm` (string, required)
   - `count` (integer, required)
   - `movie_id` (integer)
   - `poster_url` (string)
4. Set collection permissions to allow client-side **create**, **read**, and **update**
5. In **Platforms**, add both:
   - `localhost` (for development)
   - your production domain (e.g. `movie-app-one-theta-77.vercel.app`)
6. Copy the **Project ID**, **Endpoint**, **Database ID**, and **Collection ID** into `.env.local`

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Available Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start the dev server         |
| `npm run build`    | Build for production         |
| `npm run preview`  | Preview the production build |
| `npm run lint`     | Run ESLint                   |

## Deployment

This project is deployed on [Vercel](https://vercel.com/) with automatic CI/CD:

- **Push to `main`** → production build & deploy
- **Pull requests** → preview deployments per PR
- Environment variables are configured in the Vercel dashboard

To deploy your own fork:

1. Import the repo into Vercel
2. Add the same environment variables from `.env.local` in **Project Settings → Environment Variables**
3. Deploy

## Security Notes

- All API keys are read-only and exposed by design (TMDB Read Access Token + Appwrite project keys with restricted permissions)
- Appwrite platform restrictions are configured to accept requests from `localhost` and the production domain only
- `.env.local` is gitignored — **never commit your `.env` files**

## License

This project is licensed under the [MIT License](./LICENSE).

## Acknowledgments

- Movie data from [The Movie Database (TMDB)](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Inspired by the [JavaScript Mastery](https://www.javascriptmastery.com/) tutorial
