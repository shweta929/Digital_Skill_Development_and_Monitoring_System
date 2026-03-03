🎓 Digital Skill Development and Monitoring System (DSDMS)
A comprehensive full-stack web application for student skill development, career guidance, and monitoring.

📖 Project Description
The Digital Skill Development and Monitoring System (DSDMS) is designed to bridge the gap between students and their career goals. It provides a unified platform where students can track their learning progress, receive AI-generated career roadmaps, schedule one-on-one mentorship meetings, and build professional resumes. Administrators and trainers can monitor student progress and provide timely feedback, ensuring a structured path to career success.

🚀 Key Features
👥 Role-Based Dashboards: Dedicated interactive dashboards for Students and Administrators.
🤖 AI-Powered Career Roadmap: Generates personalized learning paths using Groq AI based on student interests and goals.
📄 Smart Resume Builder: Integrating tools to help students create industry-standard resumes.
📅 One-on-One Scheduling: Seamless booking system for students to schedule mentorship or doubt-clearing sessions.
💬 Feedback System: Robust feedback mechanism for trainers to evaluate and guide students.
📚 Learning Resources: Centralized repository for tracking learning materials and progress.
🔐 Secure Authentication: Integrated Google OAuth for secure and easy login.

🛠️ Tech Stack
**Frontend**
- Framework: React.js
- Styling: CSS / Bootstrap
- Build Tool: Vite / NPM

**Backend**
- Framework: Java Spring Boot (Multiple Modules)
- AI Service: Node.js / Integration with Groq AI

**Database**
- Relational: MySQL (User data, structured records)
- NoSQL: MongoDB (Unstructured data, logs, or flexible schemas)

**Security & AI**
- Authentication: Google OAuth 2.0
- AI Model: Groq AI SDK

🏗️ System Architecture
The project follows a modular architecture:

1. **Frontend Layer**: React-based SPA consuming REST APIs.
2. **API Gateway / Backend Layer**: Multiple Spring Boot modules handling core business logic.
3. **AI Service**: A dedicated service handling prompts and responses from Groq AI.
4. **Database Layer**:
   - The system primarily uses MySQL as the main relational database for core application data.
   - MongoDB was explored during the initial development phase for experimental and testing purposes to evaluate flexibility with unstructured data. However, MongoDB is not actively used in the final production workflow of the project.

📂 Project Structure
A brief overview of the main directories:

/Career-Portal1
├── Admin/                 # Admin dashboard and related backend services
├── Project_Cdac/          # Main application core
│   ├── frontend/          # Main React.js frontend application
│   └── backend/           # Core Spring Boot backend service
├── career-ai-backend/     # AI service module (Groq AI integration)
├── SmartResumeBuilder/    # Dedicated module for Resume Building features
├── database/              # [NEW] SQL schemas and data seeding scripts
└── README.md              # Project documentation

⚙️ How to Run the Project
*Note: This project consists of multiple services (Frontend, Backend, AI). You will need to start them individually.*

**Prerequisites**
- Node.js & npm installed
- Java JDK (17 or later) & Maven installed
- MySQL and MongoDB running locally or accessible remotely

**Steps**
1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   ```

2. **Database Configuration**
   - Ensure MySQL and MongoDB services are running.
   - Create necessary databases as specified in the configuration files.

3. **Backend Setup (Spring Boot)**
   - Navigate to the backend directories (`Project_Cdac/backend` or `Admin`).
   - Update `application.properties` with your database credentials.
   - Run the application:
     ```bash
     mvn spring-boot:run
     ```

4. **AI Service Setup**
   - Navigate to `career-ai-backend`.
   - Install dependencies: `npm install`
   - Start the service: `node index.js` (or `npm start`)

5. **Frontend Setup (React)**
   - Navigate to the frontend directory (`Project_Cdac/frontend`).
   - Install dependencies: `npm install`
   - Start the development server:
     ```bash
     npm run dev
     ```

6. **Access the Application**
   - Open your browser and navigate to the local URL (typically `http://localhost:5173` or similar).

🔐 Security Note
This project uses Environment Variables (`.env`, `application.properties`) to store sensitive keys such as API tokens, Database credentials, and OAuth secrets.
**Never commit these files to version control. Ensure they are added to .gitignore.**

🔮 Future Enhancements
- Mobile App integration using React Native.
- Advanced Analytics dashboard for Admins.
- Integration with LinkedIn API for profile importing.
- Mock Interview AI bot.

**Client**: career credentials
**Team Members**: [Shruti Shimpi, Shweta Pawar, Jay Pawar, Aakash Bhagwat]
