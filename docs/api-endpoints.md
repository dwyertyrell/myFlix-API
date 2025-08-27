# API Endpoints

This document describes all available endpoints for the myFlix API, including request/response formats and authentication requirements.

---

## Authentication
Most endpoints require a valid JWT token in the `Authorization` header as a Bearer token.

---

## Users

### Register a New User
- **POST** `/users`
- **Body:** `{ firstName, lastName, age, username, password, email, birthday }`
- **Response:** Created user object

### Get All Users
- **GET** `/users`
- **Auth:** Required
- **Response:** Array of user objects

### Get User by Username
- **GET** `/users/:username`
- **Auth:** Required
- **Response:** User object

### Update User
- **PUT** `/users/:username`
- **Auth:** Required
- **Body:** Fields to update
- **Response:** Updated user object

### Delete User
- **DELETE** `/users/:username`
- **Auth:** Required
- **Response:** Success message

### Add Movie to Favorites
- **POST** `/users/:username/movies/:movieId`
- **Auth:** Required
- **Response:** Updated user object

### Remove Movie from Favorites
- **DELETE** `/users/:username/movies/:movieId`
- **Auth:** Required
- **Response:** Updated user object

---

## Movies

### Get All Movies
- **GET** `/movies`
- **Auth:** Required
- **Response:** Array of movie objects

### Get Movie by Title
- **GET** `/movies/:title`
- **Auth:** Required
- **Response:** Movie object

### Get Genre Info
- **GET** `/movies/genre/:genreName`
- **Auth:** Required
- **Response:** Genre object

### Get Director Info
- **GET** `/movies/director/:directorName`
- **Auth:** Required
- **Response:** Director object

---

## Login

### User Login
- **POST** `/login`
- **Body:** `{ username, password }`
- **Response:** `{ user, token }`

---

For more details and examples, see the [main README](../README.md).
