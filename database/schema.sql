-- Career Portal Master SQL Schema
-- Relational Model for Students, Sessions, and Mentorship

CREATE DATABASE IF NOT EXISTS careerportal;
USE careerportal;

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(100) DEFAULT 'General',
    test_taken BOOLEAN DEFAULT FALSE,
    test_score INT DEFAULT 0,
    books_read INT DEFAULT 0,
    sessions_watched INT DEFAULT 0,
    meetings_attended INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Recorded Sessions Table
CREATE TABLE IF NOT EXISTS recorded_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    youtubeLink VARCHAR(255) NOT NULL,
    domain VARCHAR(100) DEFAULT 'General',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Books Table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100),
    pdf_url VARCHAR(255),
    thumbnail_url VARCHAR(255)
);

-- 4. Mentorship Sessions / Schedule
CREATE TABLE IF NOT EXISTS schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    trainer_name VARCHAR(255),
    meeting_date DATE,
    meeting_time TIME,
    topic VARCHAR(255),
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- 5. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    trainer_id INT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
);
