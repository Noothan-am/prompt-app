# Prompt App

A modern web application for managing and sharing prompts.

## Project Structure

- `client/` - Frontend React application
- `server/` - Backend Node.js/Express server

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Noothan-am/prompt-app.git
cd prompt-app
```

2. Set up environment variables:

```bash
# Client environment variables
cd client
cp .env.example .env
# Update .env file with your Firebase client configuration

# Server environment variables
cd ../server
cp .env.example .env
# Update .env file with your JWT secret and other server configuration
```

3. Install dependencies:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

4. Start the development servers:

```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

## Environment Variables

### Client Environment Variables

The client application uses environment variables to manage Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Server Environment Variables

The server uses these environment variables:

```
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
NODE_ENV=development

# For local development with Firebase Admin SDK (optional)
# FIREBASE_PROJECT_ID=your_project_id
# FIREBASE_CLIENT_EMAIL=your_client_email
# FIREBASE_PRIVATE_KEY="your_private_key"
```

## Features

- Modern React frontend
- Express.js backend
- RESTful API
- User authentication
- Prompt management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
