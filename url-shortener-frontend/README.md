# URL Shortener Frontend

This is the frontend application for the URL Shortener project, built with React, TypeScript, and Vite. It provides a modern user interface for shortening URLs, managing user authentication, and viewing list of urls.

## 🚀 Setup Instructions

Follow these steps to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/) (LTS version recommended)
-   [npm](https://www.npmjs.com/) (included with Node.js)
-   Backend server running on `http://localhost:5001` (or your configured URL)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**

    Create a `.env` file in the root of the `frontend` directory:

    ```bash
    touch .env
    ```

    Add the following environment variable (match this with your backend URL):

    ```env
    VITE_API_BASE_URL=http://localhost:5001/api
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Access the application at `http://localhost:5173`.


## 📂 Project Structure

```
frontend/
├── .env                # Environment variables
├── public/             # Static assets
├── src/
│   ├── api/            # API client configuration (Axios)
│   ├── assets/         # Global assets and images
│   ├── components/     # Reusable UI components
│   │   ├── Auth/       # Login and Registration forms
│   │   ├── Dashboard/  # Dashboard views (UrlTable)
│   │   ├── Layout/     # Layout wrappers (Navbar, Sidebar)
│   │   └── UrlShortener/ # Core URL shortening input/display
│   ├── redux/          # Redux state management
│   │   ├── slices/     # Feature slices (authSlice, urlSlice)
│   │   └── store.ts    # Redux store configuration
│   ├── types/          # TypeScript interfaces and types
│   ├── App.tsx         # Main application component with routing
│   └── main.tsx        # Application entry point
├── package.json        # Dependencies and scripts
└── vite.config.ts      # Vite configuration
```


## 🧠 Design Decisions

-   **Redux Toolkit**: Chosen for global state management to handle complex states like user authentication status and the list of URLs. It simplifies asynchronous logic (via `createAsyncThunk`) and ensures predictable state updates.
-   **Axios Interceptors**: Implemented to automatically attach the JWT token to every request and globally handle `401 Unauthorized` errors by redirecting the user to login. This keeps components clean of authentication logic.
-   **Modular Architecture**: Components are strictly organized by feature (Auth, Dashboard, UrlShortener) rather than type. This improves maintainability and scalability.
-   **TypeScript**: Used extensively to ensure type safety for API responses, Redux state, and Component props, reducing runtime errors.

## ⚠️ Known Limitations

-   **Pagination**: The dashboard currently loads a list of URLs (defaulting to the backend limit, likely 100). Full pagination controls (Next/Prev pages) are not yet implemented in the UI.
-   **Persistence**: Authentication state is persisted in `localStorage`. While standard for many applications, more sensitive applications might prefer HTTP-only cookies.
-   **Data Validation**: Frontend relies on HTML5 validation and basic types. Comprehensive schema validation (e.g., Zod, Yap) could be added for more robust form handling.
