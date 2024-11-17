# Response Code List Manager

This is a web-based application for managing HTTP response code lists, including functionalities like searching, saving, editing, and deleting lists. The app also allows users to view images corresponding to HTTP status codes fetched from [http.dog](https://http.dog).

## Features

### 1. User Authentication
- **Signup and Login:** Users can create accounts and log in securely.
- **Protected Actions:** Saving and managing lists require authentication.

### 2. Search Page
- **Filtering:** Search for HTTP response codes using filters like:
  - Exact codes (e.g., `203`)
  - Prefix filters (e.g., `2xx`, `20x`, `3xx`)
- **Image Display:** Displays dog images corresponding to the searched codes.
- **Save Lists:** Users can save filtered results as named lists with:
  - List name
  - Creation date
  - Response codes
  - Image links

### 3. Lists Page
- **List Management:** View, edit, and delete previously saved lists.
- **Details View:** Displays images and response codes in a selected list.
- **Editing:** Update list names, add/remove codes, or modify contents.

### 4. API Integration
- Dog images for response codes are fetched dynamically from [http.dog](https://http.dog).

---

## Tech Stack

### Backend:
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**

### Frontend:
- **React.js** (Optional; can use any preferred frontend framework)

### Other Tools:
- `dotenv` for environment variable management.
- `bcrypt` for secure password storage.
- `jsonwebtoken` for user authentication.
- `cors` for cross-origin resource sharing.

---

## Getting Started

### Prerequisites
1. Install **Node.js**.
2. Install **MongoDB** or set up a MongoDB Atlas cluster.
3. Set up an `.env` file with the following variables:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-secret-key>


#### Installation

**Clone the repository:**


git clone <repository-url>
cd response-code-list-manager

**Install dependencies:**

npm install

**Start the server:**

npm start

**Run the frontend (if applicable):**

cd frontend

npm start

### Authentication

| Method | Endpoint          | Description         |
|--------|-------------------|---------------------|
| POST   | `/api/auth/signup` | User registration   |
| POST   | `/api/auth/login`  | User login          |




### List Management

| Method | Endpoint          | Description                 |
|--------|-------------------|-----------------------------|
| GET    | `/api/lists`      | Get all lists              |
| POST   | `/api/lists`      | Save a new list            |
| GET    | `/api/lists/:id`  | Get details of a specific list |
| PUT    | `/api/lists/:id`  | Edit a saved list          |
| DELETE | `/api/lists/:id`  | Delete a saved list        |




### Search

| Method | Endpoint          | Description                                    |
|--------|-------------------|------------------------------------------------|
| GET    | `/api/search?q=`  | Search for response codes and fetch images.   |



### Runtime Complexity

#### Database Queries:

- **Search:** `O(1)` for direct lookups using indexed fields like response code.
- **List CRUD Operations:**
  1. **GET:** `O(n)` for fetching all lists (where `n` is the number of lists).
  2. **POST:** `O(1)` for saving a new list.
  3. **PUT/DELETE:** `O(1)` for updating/deleting by `_id`.

#### Filtering:

- Prefix filtering is optimized using `String.startsWith()` for small datasets.

