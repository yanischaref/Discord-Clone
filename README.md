# Web Discord Clone

This is a full web Discord clone built using React for the front-end and Node.js, Express.js, Socket.IO, and MySQL for the back-end.

## Features

- Real-time messaging with Socket.IO
- User authentication and authorization
- Channels and private messaging
- User profiles and settings
- Integration with MySQL database for persistent data storage

## Technologies Used

### Frontend
- React
- React Router (for routing)
- []

### Backend
- Node.js
- Express.js
- Socket.IO
- MySQL

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine
- MySQL server installed and running

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yanischaref/web-discord-clone.git
   ```
2. Navigate to the project directory:
   ```bash
   cd web-discord-clone
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   # For frontend
   cd discord-client
   npm install
   
   # For backend
   cd ../discord-api
   npm install
   ```

### Configuration
1. Set up your MySQL database and create the necessary tables. You can find the database schema in the `discord-api/db.sql` file.
2. Configure the backend to connect to your MySQL database by modifying the `discord-api/config/db.config.js` file.

### Running the Application
1. Start the backend server:
   ```bash
   # From the discord-api directory
   npm start
   ```
2. Start the frontend development server:
   ```bash
   # From the discord-client directory
   npm start
   ```

The application should now be running. Visit `http://localhost:3000` in your browser to access the web Discord clone.

## Contributing
Contributions are welcome! Please follow the [contribution guidelines](CONTRIBUTING.md).

## License
This project is licensed under the [MIT License](LICENSE).
