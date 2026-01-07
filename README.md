# Important note:
The frontend is included in this repository under url-shortener-frontend.
Initially, the frontend and backend were developed in separate repositories, but the submission form allows only one GitHub link.
For this reason, the frontend was merged into this repository.

The original frontend repository (with full commit history) is available here: https://github.com/TOU-HID/url-shortener-frontend

# URL Shortener Backend

A robust Node.js/Express backend for a URL shortening service, built with TypeScript and MongoDB.

## 1. Setup Instructions

### Prerequisites
- Node.js (Please use updated version >= 20.19.0)
- MongoDB (Local or Atlas connection string).
- npm (By default come with node.js)

### Installation

1.  **Clone the repository first:**

    ```bash
    git clone <repository-url>
    cd frontend

2.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration
Create a `.env` file in the root of the `backend` directory with the following variables:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/url-shortener # Or your Atlas URI
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173 # URL of your frontend application
BASE_URL=http://localhost:5001 # Base URL for shortened links
NODE_ENV=development
```

### Running the Application
*   **Development Mode** (with hot-reload):
    ```bash
    npm run dev
    ```
*   **Build & Start**:
    ```bash
    npm run build
    npm start
    ```

## 2. Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers (Auth, URLs)
│   ├── middlewares/    # Custom middlewares (Auth protection)
│   ├── models/         # Mongoose models (User, Url)
│   ├── routes/         # Route definitions
│   ├── utils/          # Utility functions (Short code generator)
│   └── server.ts       # Application entry point
├── dist/               # Compiled JavaScript files
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 3. API Documentation

### Authentication

#### Register User
*   **Endpoint**: `POST /api/auth/register`
*   **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response**: `201 Created`
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user": { ... },
        "token": "jwt_token_here"
      }
    }
    ```

#### Login User
*   **Endpoint**: `POST /api/auth/login`
*   **Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response**: `200 OK`
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "user": { ... },
        "token": "jwt_token_here"
      }
    }
    ```

### URL Management (Protected)
*All these endpoints require the `Authorization: Bearer <token>` header.*

#### Create Short URL
*   **Endpoint**: `POST /api/urls`
*   **Body**:
    ```json
    {
      "originalUrl": "https://www.verylongwebsite.com/some/long/path"
    }
    ```
*   **Response**: `201 Created`
    ```json
    {
      "success": true,
      "data": {
        "originalUrl": "...",
        "shortCode": "AbCd12",
        "shortUrl": "http://localhost:5000/AbCd12",
        "clicks": 0
      }
    }
    ```

#### Get User URLs
*   **Endpoint**: `GET /api/urls`
*   **Response**: `200 OK`
    ```json
    {
      "success": true,
      "data": {
        "urls": [ ... ],
        "totalCount": 5,
        "limit": 100
      }
    }
    ```

#### Delete URL
*   **Endpoint**: `DELETE /api/urls/:id`
*   **Response**: `200 OK`
    ```json
    {
      "success": true,
      "message": "URL deleted successfully"
    }
    ```

### Public Access

#### Redirect to Original URL
*   **Endpoint**: `GET /:shortCode`
*   **Description**: Redirects the user to the original URL associated with the short code and increments the click count for performance tracking.
*   **Response**: `302 Found` (Redirect) or `404 Not Found`

## 4. Design Decisions

*   **TypeScript**: Used for type safety and better developer experience, reducing runtime errors.
*   **MVC Architecture**: Separation of concerns (Models, Views/Controllers, Routes) to keep the codebase modular and maintainable.
*   **JWT Authentication**: Stateless authentication mechanism suitable for modern web applications.
*   **Mongoose & MongoDB**: Flexible schema design with strict validation at the application level.
    *   **Normalization**: URLs are normalized (ensuring `https://` protocol) before saving.
    *   **Indexing**: `shortCode` needs to be unique and is indexed for fast lookups.
*   **Validation**: Input validation is handled manually in controllers to provide specific error messages.
