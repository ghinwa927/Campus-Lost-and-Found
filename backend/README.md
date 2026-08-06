# Campus Lost & Found API

Backend API for the Campus Lost & Found platform, built with **Fastify**, **TypeScript**, and **MongoDB**.

The platform allows students to report lost or found items, browse reports, search and filter items, and update or remove reports.

## Tech Stack

* **Fastify** — Backend web framework
* **TypeScript** — Type-safe development
* **MongoDB** — Database
* **MongoDB Node.js Driver** — Database connection and operations
* **@fastify/cors** — Cross-Origin Resource Sharing
* **@fastify/env** — Environment variable validation
* **tsx** — TypeScript development runner

## Project Structure

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   │
│   ├── config/
│   ├── plugins/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── schemas/
│   ├── types/
│   ├── middleware/
│   └── utils/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Database

The project uses MongoDB with the following collections:

```text
campus-lost-found
├── categories
└── items
```

### Categories

Each category contains:

* `_id`
* `name`
* `slug`
* `icon`
* `createdAt`
* `updatedAt`

### Items

Each lost/found report contains:

* `_id`
* `title`
* `type`
* `categoryId`
* `description`
* `location`
* `date`
* `imageUrl`
* `reporterName`
* `reporterEmail`
* `status`
* `createdAt`
* `updatedAt`

`type` can be:

```text
lost
found
```

`status` can be:

```text
active
resolved
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file based on `.env.example`.

```env
PORT=5000
HOST=0.0.0.0

MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=campus-lost-found
```

### 3. Start the development server

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

## API

The main item endpoints will be:

```text
GET    /api/items
GET    /api/items/:id
POST   /api/items
PUT    /api/items/:id
DELETE /api/items/:id
```

Category endpoints:

```text
GET    /api/categories
GET    /api/categories/:id
```

Filtering items will support queries such as:

```text
GET /api/items?type=lost
GET /api/items?type=found
GET /api/items?category=electronics
GET /api/items?location=library
GET /api/items?search=airpods
```

## Development

Run the development server with:

```bash
npm run dev
```

Run the production start command with:

```bash
npm start
```

## Project Goal

This project is designed as a learning project for **Nuxt + Fastify + MongoDB**.

The main focus is understanding:

* REST API development
* Fastify routes and plugins
* Request validation
* CRUD operations
* MongoDB queries
* TypeScript
* Frontend/backend communication
