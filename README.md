# ICPC Quest frontend

This repository contains the frontend for the ICPC Quest project along with scripts to manage the Pocketbase backend.

## Table of Contents

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Dev Container](#dev-container)
- [Running the Frontend Locally](#running-the-frontend-locally)
- [Building the Frontend](#building-the-frontend)
- [Pocketbase Backend](#pocketbase-backend)
  - [Local Installation of Pocketbase](#local-installation-of-pocketbase)
  - [Running Pocketbase](#running-pocketbase)
  - [Pocketbase Subcommands](#pocketbase-subcommands)
- [pb_migrations Explained](#pb_migrations-explained)
- [Code Quality: ESLint & Prettier](#code-quality-eslint--prettier)

## Installation

1. **Frontend Dependencies:**  
   Install dependencies using [pnpm](https://pnpm.io/):

   ```bash
   pnpm install
   ```

2. **Local Installation of Pocketbase:**
   - Download the latest release from the [Pocketbase website](https://pocketbase.io/).
   - Unpack the downloaded archive.
   - Make sure it's invokable as `pocketbase`.

## Project Structure

Most code lives in `src` and follows a feature-first layout:

- `src/routes/`: application routes.
- `src/features/`: feature modules (may include `components/`, `utils/`, `hooks/`, `api/`, `types/`, `stores/`).
- `src/components/`, `src/hooks/`, `src/types/`, `src/utils/`: shared cross-feature modules.
- Entry points: `src/main.tsx`, `src/routes/__root.tsx`.

## Dev Container

This repo ships a Dev Container that includes Node.js (via `typescript-node`), pnpm (through `corepack`), and the PocketBase CLI (v0.26.3) preinstalled.

1. Install the VS Code Dev Containers extension (or a compatible client like GitHub Codespaces).
2. Open the repository in VS Code and choose **Reopen in Container**.
3. After the container builds, dependencies are installed automatically via `pnpm install`.
4. To work as usual inside the container:
   - Frontend: `pnpm start`
   - PocketBase: `pnpm run pocketbase` (data persists in `pocketbase/pb_data`)
   - Types: `pnpm run pocketbase:typegen`

## Running the Frontend Locally

To start the frontend in development mode, run:

```bash
pnpm start
```

This will launch the Vite development server. By default, it will be available at [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

You can set environment variables in a `.env` file or directly in your shell before running the command if you need to override defaults (e.g., `VITE_POCKETBASE_URL`).

## Building the Frontend

Set the environment variables and build the project:

```batch
set PUBLIC_URL=https://news.icpc.global/quest
set VITE_POCKETBASE_URL=https://quest.live.icpc.global
pnpm run build
```

## Pocketbase Backend

### Running Pocketbase

There are several ways to run the Pocketbase backend:

- **Development Mode:**  
  Run the following command from the project root:

  ```bash
  pnpm run pocketbase
  ```

  This command changes directory into the `pocketbase` folder and starts Pocketbase in development mode with migrations enabled.

- **Using Docker Compose:**  
  If you prefer using Docker, you can run the backend with:
  ```bash
  docker-compose -f docker-compose.yml up -d
  ```

### Pocketbase Subcommands

> **Note:** By the time you run any of these Pocketbase scripts, ensure that Pocketbase has already been initialized (i.e., run at least once to set up the initial database and configuration).

- **Migrations:**  
  Update your collections/migrations using:

  ```bash
  pnpm run pocketbase:migration
  ```

  This creates a new db snapshot into the `pocketbase/pb_migrations` directory.

- **Type Generation:**  
  Generate TypeScript types for the Pocketbase collections:
  ```bash
  pnpm run pocketbase:typegen
  ```
  This outputs type definitions based on your Pocketbase schema to `src/types/pocketbase-types.ts`.

## pb_migrations Explained

The `pb_migrations` directory contains migration scripts that define adjustments to the Pocketbase database schema. Each migration script:

- References and alters a specific collection.
- Uses a version number (e.g., `1747019227_updated_submissions.js`) to track changes.
- Implements two functions: one for migrating **forward** (applying changes) and one for **rolling back** (reverting changes).

These scripts allow you to version control your database schema changes much like code, ensuring consistency across different environments.

Migrations are automatically generated whenever you make changes to your collections through the Pocketbase Admin UI. This includes:

- Creating or modifying fields
- Adding or updating rules
- Changing collection settings

When you run `pnpm run pocketbase:migration`, it creates a snapshot of these changes. While this automatic generation is convenient for tracking changes, it can result in many small migration files if you're making frequent updates.

For more complex changes, you might want to make all your modifications first and then generate a single migration. This keeps your migration history cleaner and makes it easier to understand the overall changes to your schema. Remember to test your migrations in a development environment before applying them to production.

## Code Quality: ESLint & Prettier

This project uses **ESLint** for code linting and **Prettier** for code formatting. Both tools help maintain code quality and consistency.

- **ESLint** checks for code issues and enforces best practices. Run linting with:
  ```bash
  pnpm exec eslint .
  ```
- **Prettier** automatically formats your code. Run formatting with:
  ```bash
  pnpm exec prettier --write .
  ```

You can also integrate these tools with your editor for real-time feedback and auto-formatting on save.
