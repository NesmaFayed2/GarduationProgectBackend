# Smart Surveillance System for Emergency Detection

## Project Overview
The Smart Surveillance System for Emergency Detection is an advanced solution designed to enhance security through automated surveillance and real-time emergency detection. This project integrates various technologies to provide a comprehensive system for monitoring and threat detection.

## Backend Development

### Key Components

- **Node.js**: The backend server is built using Node.js, which provides a robust and scalable architecture for handling server-side logic and processing requests.

- **User Authentication**: Secure user authentication mechanisms are implemented to manage access control and protect sensitive data. This includes secure login, registration, and session management.

- **Real-Time Data Handling**:
  - **RabbitMQ**: Used for message queuing, RabbitMQ ensures reliable communication between different components of the system.
  - **Socket.IO**: Integrated for real-time communication, allowing instant data updates and interactions within the system.

- **API Development**:
  - **RESTful APIs**: Designed and deployed RESTful APIs to facilitate seamless interaction between the backend server and the Flutter-based frontend application. These APIs manage data flow and interaction between the frontend and backend.

- **AI Integration**:
  - **AI Modules**: The backend integrates with AI modules to enable real-time processing and decision-making based on AI-driven analysis.
  - **Inter-Server Communication**: Manages communication between the backend server and AI modules to optimize system performance and accuracy.

- **Mongoose**: Used for MongoDB object modeling, Mongoose provides a schema-based solution for data management, making database operations more efficient and organized.

## Setup and Installation

### Prerequisites
Before you begin, ensure you have the following installed:

- **Node.js**: The runtime environment for running the backend server. [Download Node.js](https://nodejs.org/)

- **RabbitMQ**: The message broker used for real-time data handling. [Download RabbitMQ](https://www.rabbitmq.com/download.html)

- **Socket.IO**: A library for real-time communication between the server and clients. It will be installed via Node.js dependencies.

- **Postman**: Recommended for testing your API endpoints. [Download Postman](https://www.postman.com/downloads/)

### Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/NesmaFayed2/GarduationProgectBackend.git
   cd GarduationProgectBackend
