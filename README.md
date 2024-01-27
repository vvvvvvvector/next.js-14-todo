# Yet another ToDo

An open source application built using [Next.js 14](https://nextjs.org/).

[Deploy link](https://nextjs-14-todo.vercel.app/)

## Features

- Authentication (using username & password) / Registration
- Task have a title, description, done state and due date field
- User can see the list of the tasks
- User can filter the tasks by name & description
- User can create / modify / delete a task
- Users can share their tasks via URL
- Users can add comments to the task

## Technology stack

- Next.js 14 (app router, route handlers, server actions)
- Prisma
- Database on PlanetScale
- UI lib shadcn-ui
- Tailwind CSS
- react-hook-form
- zod (form validation, API response validation, etc.)
- TypeScript
- next-safe-action
- deploy to Vercel

## Running locally

1. Install dependencies using npm:

```sh
npm i
```

2. Copy `.env.example` to `.env.local` and update the variables.

```sh
cp .env.example .env.local
```

3. Start the development server:

```sh
npm run dev
```
