# Models

This document describes the Mongoose models used in the myFlix API.

---

## Movie Model

```js
const movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    title: String,
  },
  director: {
    name: String,
    bio: String,
    birthday: Date,
    deathYear: Date
  },
  actors: [String],
  image: String,
  featured: Boolean
});
```

### Fields
- `title`: Movie title (required)
- `description`: Movie description (required)
- `genre.title`: Genre name
- `director`: Director details
- `actors`: Array of actor names
- `image`: Image URL
- `featured`: Boolean flag

---

## User Model

```js
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favouriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});
```

### Fields
- `firstName`, `lastName`, `age`, `username`, `password`, `email`, `birthday`: User details
- `favouriteMovies`: Array of favorite movie IDs

---

## Methods

- `userSchema.statics.hashPassword(password)`: Hashes a password
- `userSchema.methods.validatePassword(password)`: Validates a password

For more details, see the source code in [models.js](../models.js).
