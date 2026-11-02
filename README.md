# Movie Watchlist API

A backend API for managing a movie watchlist. You can add, view, update and delete movies. Built to practise the flow **Client → Route → Controller → Data → Response**.

## Technologies Used
- Node.js
- Express.js
- JavaScript (data is stored temporarily in an array, no database)

## Project Structure
```
movie-api/
├── controllers/
│   └── movieController.js   # CRUD logic + validation
├── routes/
│   └── movieRoutes.js       # connects endpoints to controllers
├── app.js                   # starts the server
├── package.json
└── package-lock.json
```

## Installation
1. Make sure [Node.js](https://nodejs.org) is installed.
2. Open a terminal in the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```

## Starting the Server
```bash
npm start
```
The server runs on `http://localhost:3000`.
Note: data is stored in memory, so it resets every time the server restarts.

## Movie Object
| Field   | Type    | Description                    |
|---------|---------|--------------------------------|
| id      | number  | Unique ID (created by the API) |
| title   | string  | Name of the movie              |
| genre   | string  | Movie genre                    |
| year    | number  | Release year                   |
| watched | boolean | Whether the movie was watched  |

## Available Endpoints
| Action         | Method | Endpoint          | Success | Errors   |
|----------------|--------|-------------------|---------|----------|
| Get all movies | GET    | `/api/movies`     | 200     |          |
| Get one movie  | GET    | `/api/movies/:id` | 200     | 400, 404 |
| Create movie   | POST   | `/api/movies`     | 201     | 400      |
| Update movie   | PUT    | `/api/movies/:id` | 200     | 400, 404 |
| Delete movie   | DELETE | `/api/movies/:id` | 200     | 400, 404 |

### Example: create a movie
`POST /api/movies` with a JSON body:
```json
{ "title": "Spirited Away", "genre": "Animation", "year": 2001, "watched": false }
```

### Example: update a movie
`PUT /api/movies/6` (send only the fields you want to change):
```json
{ "watched": true }
```

## Error Handling
- **404** – movie does not exist: `{ "message": "Movie with ID 999 not found" }`
- **400** – invalid ID (e.g. `/api/movies/abc`)
- **400** – missing or invalid movie data (the response lists what is wrong)
- **400** – broken JSON in the request body

## How to Test the API
Use Postman, Thunder Client or Insomnia. For POST and PUT, set the body to **raw → JSON**. Tests to run:
1. GET `/api/movies`
2. GET `/api/movies/1`
3. GET `/api/movies/999` (404)
4. POST `/api/movies` with a new movie
5. GET the new movie
6. PUT the new movie
7. GET it again to confirm the changes
8. DELETE it
9. GET the deleted movie (404)
10. PUT and DELETE on `/api/movies/999` (404)
