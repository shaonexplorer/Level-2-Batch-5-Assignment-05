# Assignment 05 - L2B5 - (Parcel Delivery API)

---

## Description

The API is built with TypeScript and Express, designed to manage simple parcel delivery system. It provides endpoints for autentications and CRUD operations on user and parcel management.

---

## Features

- CRUD operations for parcel
- Data Validation
- Error Handling
- Filtering parcel by status, sender and receiver,
- sorting and pagination

---

## Technologies Used

- **TypeScript**
- **Node.js**
- **Express.js**
- **MongoDB with Mongoose**
- **Zod validation/mongoose validation**

---

## Getting Started

Instructions on how to get the project up and running locally.

### Prerequisites

What you need to install before setting up the project.

- Node.js (LTS version recommended)
- npm or Yarn (package manager)
- MongoDB

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/shaonexplorer/Level-2-Batch-5-Assignment-05.git
    cd your-api-project
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory of the project and add the following:

    ```

    ```

# mongoDB

PORT=5000
MONGODB_CONNECTION_STRING= your_database_connection_string

# jwt

JWT_SECRET = your jwt secret

# admin email/password

ADMIN_EMAIL= set email for admin
ADMIN_PASSWORD= set password for admin

````

    _Make sure to replace placeholders like `your_database_connection_string`,`your jwt secret` with your actual values.

4.  **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn run dev
    ```
    The API should now be running at `http://localhost:5000`

---

## API Endpoints

| Method   | Endpoint                                   | Description                                |
| :------- | :----------------------------------------- | :----------------------------------------- |
|  POST	   |    /api/v1/user/register                   |	Register a new user                      |
|  POST    |	/api/v1/auth/login                      |	Login an admin or sender                 |
|  POST    |	/api/v1/auth/logout                     |	Logout a user                            |
|  GET     |	/api/v1/user/all                        |	Get all users                            |
|  GET     |	/api/v1/user/:userId                    |	Get user by ID                           |
|  PATCH   |	/api/v1/user/:userId                    |	Update user by ID                        |
|  PATCH   |	/api/v1/user/block/:userId              |	Block user by ID                         |
|  DELETE  |	/api/v1/user/:userId                    |	Delete user by ID                        |
|  POST    |	/api/v1/parcel                          |	Create a new parcel                      |
|  PATCH   |	/api/v1/parcel/:parcelId                |	Update a parcel                          |
|  PATCH   |	/api/v1/parcel/:parcelId                |	Update a parcel's status                 |
|  GET     |	/api/v1/parcel?status=pending_pickup    |   Get all parcels (with optional filters)  |
|  GET     |	/api/v1/parcel/me                       |	Get parcels for the authenticated user   |
|  GET     |	/api/v1/parcel/:trackingNumber          |	Track a parcel using its tracking number |
|  PATCH   |	/api/v1/parcel/cancel/:parcelId         |	Cancel a parcel                          |

---
````
