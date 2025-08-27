# myFlix API

Welcome to the myFlix API! This is a RESTful web service for managing movie data and user accounts. It provides endpoints for user registration, authentication, and CRUD operations on movies and users.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Models](#models)
- [Contributing](#contributing)
- [License](#license)
- [Documentation](docs/README.md)

## Features

- User registration and authentication (JWT)
- Secure password hashing
- CRUD operations for movies and users
- Favorite movies management
- CORS support
- Input validation

## Getting Started

### Prerequisites

- Node.js
- MongoDB database

### Installation

1. Clone the repository:
	```sh
	git clone https://github.com/dwyertyrell/myFlix-API.git
	```
2. Install dependencies:
	```sh
	npm install
	```
3. Set up your environment variables (see `.env.example`):
	- `CONNECTION_URI` for MongoDB
	- `JWT_SECRET` for authentication
4. Start the server:
	```sh
	npm start
	```

## API Endpoints

See [docs/api-endpoints.md](docs/api-endpoints.md) for a full list of endpoints, request/response formats, and usage examples.

## Authentication

Authentication is handled via JWT. See [docs/authentication.md](docs/authentication.md) for details on login, token usage, and securing endpoints.

## Models

The API uses Mongoose models for `Movie` and `User`. See [docs/models.md](docs/models.md) for schema details.

## Contributing

Contributions are welcome! Please see [docs/contributing.md](docs/contributing.md) for guidelines.

## License

This project is licensed under the MIT License.

## Documentation

For detailed documentation, see the [docs/](docs/README.md) directory.

