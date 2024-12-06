# IRCTC BOOKING API

This is a REST API for managing train bookings, including user registration, login, adding new trains, checking seat availability, and making bookings. The API uses Express.js for the backend, PostgreSQL for data storage, and includes authentication via JWT and role-based access control with API keys.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [POST /register](#post-register)
  - [POST /login](#post-login)
  - [POST /admin/addtrain](#post-adminaddtrain)
  - [GET /trains](#get-trains)
  - [POST /book](#post-book)
  - [GET /booking/:id](#get-bookingid)
- [Middleware](#middleware)
- [Running the Application](#running-the-application)

## Installation

1. Clone this repository to your local machine.

    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2. Install dependencies.

    ```bash
    npm install
    ```

3. Make sure you have a PostgreSQL database set up. You can set up a local database or use a cloud-based one.

4. Create the necessary tables (`users`, `trains`, `bookings`) as described in the SQL schema section.

5. Add the required environment variables.

## Environment Variables

Ensure you have the following environment variables set in your `.env` file:

```env
POSTGRES_CONNECTION_URI=your-database-uri
ADMIN_API_KEY=your-admin-api-key
JWT_SECRET=your-jwt-secret
PORT=3000
```

## Endpoints

### POST /register
**Description:** Registers a new user.

**Request Body:**
```json
{
  "username": "user1",
  "password": "password123",
  "role": "user"
}
```
**Response :**

```json
{
  "message": "You have signed up",
  "user": {
    "id": 1,
    "username": "user1",
    "role": "user"
  }
}
```
**Error Responses:**
```
400: Username already exists
500: User registration failed
```


### POST /login
**Description:** Logs in a user and returns a JWT token.


Request Body:
```json
{
  "username": "user1",
  "password": "password123"
}
```
Response:

```json
{
  "token": "your-jwt-token"
}
```
Error Responses:
```
401: Invalid credentials
500: Login failed
POST /admin/addtrain
Description: Adds a new train (Admin only).
```

### POST /admin/addtrain
**Description:** Adds a train based on JWT token and ADMIN_API_KEY .
Request Body:

```json
{
  "name": "Express Train",
  "source": "City A",
  "destination": "City B",
  "total_seats": 100
}
```
Response:

```json
{
  "message": "Train added successfully",
  "train": {
    "id": 1,
    "name": "Express Train",
    "source": "City A",
    "destination": "City B",
    "total_seats": 100,
    "available_seats": 100
  }
}
```
Error Responses:
```
403: Forbidden - API Key is missing or invalid
500: Failed to add train
GET /trains
Description: Fetches trains based on source and destination.
```


### GET /train
**Description:** user can enter the source and destination and fetch all the trains between that route with their
availabilities

```json

{
  "source": "City A",
  "destination": "City B"
}
```
Response:

```json
{
  "trains": [
    {
      "id": 1,
      "name": "Express Train",
      "source": "City A",
      "destination": "City B",
      "total_seats": 100,
      "available_seats": 100
    }
  ]
}
```
Error Responses:
```
500: Failed to fetch trains
POST /book
Description: Books seats on a train for the logged-in user.
```



### POST /book
**Description:** Book seats in a particular  train
Request Body:

```json
{
  "trainId": 1,
  "seatCount": 2
}
```
Response:

```json
{
  "booking": {
    "id": 1,
    "user_id": 1,
    "train_id": 1,
    "seat_count": 2
  }
}
```
Error Responses:
```
400: Insufficient seats available
500: Booking failed
GET /booking/:id
Description: Fetches details of a specific booking for the logged-in user.
```


### POST /booking/:id
**Description:** Get Specific Booking Details
```json
{
  "booking": {
    "id": 1,
    "user_id": 1,
    "train_id": 1,
    "seat_count": 2
  }
}
```
Error Responses:
```
404: Booking not found
500: Failed to fetch booking details
Middleware
authMiddleware
This middleware verifies if the user is authenticated by checking the JWT token. If the token is valid, it adds the user information to the request object.
```
## Middleware
##### authorizeRoleWithApiKey
This middleware checks if the user is authorized to perform an action based on their role and the provided API key. It is used to protect admin routes.
##### authMiddleware
This middleware is used for JWT authentication

### Running the Application
To run the application, use the following command:
```bash
npm start
```
The server will start on http://localhost:3000. Ensure that your database is running and the necessary tables are set up.