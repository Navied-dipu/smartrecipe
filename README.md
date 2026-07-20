# SmartRecipe Frontend

SmartRecipe Frontend is the modern, responsive web application for the SmartRecipe platform, built with [Next.js](https://nextjs.org) and React. It interfaces with the SmartRecipe Node.js backend to provide users with AI-generated recipes, search functionality, and personalized recommendations.

## Features

- **Next.js App Router**: Utilizes the modern App Router architecture for seamless routing and server-side rendering.
- **Dynamic Design**: A responsive, vibrant user interface built with Tailwind CSS.
- **React Query**: Efficient data fetching, caching, and synchronization using `@tanstack/react-query`.
- **Better Auth**: Integrated secure authentication.
- **Form Handling**: Client-side form validation using `react-hook-form` and `zod`.

## Project Structure

- `src/app/` - Next.js application routes and pages (App Router).
- `src/components/` - Reusable UI components.
- `src/hooks/` - Custom React hooks for data fetching and state management.
- `src/lib/` - Utility functions, API configuration, and authentication setup.
- `src/types/` - TypeScript interface definitions.

## Prerequisites

- Node.js (v18 or higher recommended)
- A running instance of the [SmartRecipe Backend](../smartrecipe-backend)

## Getting Started

1. **Clone and Install**
   ```bash
   cd smartrecipe-frontend
   npm install
   ```

2. **Environment Setup**
   Ensure you have a `.env` file at the root of the frontend project:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_URL=http://localhost:5000
   BETTER_AUTH_SECRET=your_secret_key
   BETTER_AUTH_URL=http://localhost:3000
   MONGO_URI=your_mongodb_uri
   ```
   *(Note: The `NEXT_PUBLIC_API_URL` should point to your backend server)*

3. **Running the Application**
   Start the development server on port 3000:
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## Building for Production

To build the application for production, run:
```bash
npm run build
```
Then start the production server:
```bash
npm run start
```

## Connecting to the Backend

All API requests are routed through `src/lib/api.ts`, which defaults to the `NEXT_PUBLIC_API_URL`. Ensure both the frontend and backend servers are running simultaneously during local development.
