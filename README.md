# myFlix API

A RESTful API for managing movie data and user accounts, built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Models](#models)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The myFlix API allows users to:
- Register and manage accounts
- Browse and search for movies
- Add or remove favorite movies
- View information about genres and directors

---

## Features

- User registration and authentication (JWT)
- CRUD operations for users and movies
- Add/remove favorite movies
- CORS enabled for specific origins
- Input validation and error handling

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)

### Installation

```bash
git clone https://github.com/yourusername/myFlix-API.git
cd myFlix-API
npm install
```

### Environment Variables

  Environment variables are set in Heroku Config Vars for production deployment
  Uses ternary operator to check for availability of connection strings 
 
  Priority order:
  1. `process.env.MONGO_AWS_URI` - MongoDB on EC2 instance (AWS)
  2. `process.env.CONNECTION_URI` - MongoDB Atlas Connection

### Running the Server

```bash
npm start
```
---

## API Endpoints

See [docs/api-endpoints.md](docs/api-endpoints.md) for full documentation.

**Examples:**

- `GET /movies` — Get all movies
- `GET /movies/:title` — Get a movie by title
- `POST /users` — Register a new user
- `PUT /users/:username` — Update user info
- `PUT /users/:username/:movieId` — Add a movie to favorites
- `DELETE /users/:username/:movieId` — Remove a movie from favorites

---

## Authentication

- Uses JWT for protected routes.
- Register and log in to receive a token.
- Include the token in the `Authorization` header as `Bearer <token>`.

---

## Models

See [docs/models.md](docs/models.md) for detailed schema information.

---

## Error Handling

- Returns appropriate HTTP status codes and error messages for invalid requests or server errors.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

See [docs/contributing.md](docs/contributing.md) for guidelines.

---

## License

[MIT](LICENSE)