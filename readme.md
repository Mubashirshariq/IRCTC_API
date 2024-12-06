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
