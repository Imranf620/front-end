# Frontend README

## Project Overview
This frontend application is built using **React.js** with modern JavaScript and TypeScript practices. It provides a responsive user interface for file management, user authentication, and interaction with the backend APIs. The project is optimized for performance and usability.

## Features
- User authentication with secure login and registration.
- File management interface with upload, delete, and trash functionalities.
- Integration with the backend API for seamless communication.
- State management using Redux.
- Responsive design for desktop and mobile devices.

## Prerequisites
- Node.js v18.x
- NVM for managing Node.js versions

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Imranf620/front-end/
   cd frontend
   ```

2. **Install Node.js:**
   Use NVM to install and use Node.js 18.x:
   ```bash
   nvm install 18
   nvm use 18
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Setup Environment Variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   REACT_APP_API_BASE_URL=<backend_api_url>

   ```

5. **Start the Development Server:**
   ```bash
   npm start
   ```
   The application will start on `http://localhost:3000`.

## Folder Structure
- `src/components` - Reusable React components.
- `src/redux` - Redux store, actions, and reducers.
- `src/pages` - Page components for routing.
- `src/utils` - Utility functions.

## Available Scripts

### Start the Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Linting and Formatting
- **Lint:**
  ```bash
  npm run lint
  ```
- **Format:**
  ```bash
  npm run format
  ```

## Deployment
The project can be deployed on any static hosting service like AWS EC2, Netlify, or Vercel. Build the production-ready application using:
```bash
npm run build
```
Then upload the contents of the `build` folder to your hosting provider.

## Contributions
Contributions are welcome! Please open issues or submit pull requests. Ensure to follow the project's coding standards and include appropriate test cases.

---

## License
This project is licensed under the MIT License.
