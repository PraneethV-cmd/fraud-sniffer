--Drop all table if already exists
DROP TABLE IF EXISTS assignment_participants CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS assignmentsinfo CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS plagiarism_reports CASCADE;

-- Create Users Table with Hashed Password Support
CREATE TABLE users (
  userID SERIAL PRIMARY KEY,
  userName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL, -- Support for hashed passwords
  email VARCHAR(255) NOT NULL UNIQUE
);

-- Create Assignments Table with Secure Join Code
CREATE TABLE assignments (
  assignmentID SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  difficulty VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'ACTIVE',
  filename TEXT NOT NULL DEFAULT 'no_file',
  originalFilename TEXT NOT NULL DEFAULT 'no_file',
  filePath TEXT NOT NULL DEFAULT '',
  fileType VARCHAR(255) NOT NULL DEFAULT 'unknown',
  fileSize BIGINT NOT NULL DEFAULT 0,
  isZip BOOLEAN DEFAULT FALSE,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  join_code TEXT NOT NULL UNIQUE CHECK (LENGTH(join_code) > 5),
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Assignments Info Table with ENUM-like Status Check
CREATE TABLE assignmentsinfo (
  assignmentInfoID SERIAL PRIMARY KEY,
  assignmentID INT NOT NULL,
  userID INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignmentID) REFERENCES assignments(assignmentID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Submissions Table
CREATE TABLE submissions (
  submissionID SERIAL PRIMARY KEY,
  assignmentInfoID INT NOT NULL,
  submissionFilename TEXT NOT NULL DEFAULT 'no_file',
  submissionOriginalFilename TEXT NOT NULL DEFAULT 'no_file',
  submissionFilePath TEXT NOT NULL DEFAULT '',
  submissionFileType VARCHAR(255) NOT NULL DEFAULT 'unknown',
  submissionFileSize BIGINT NOT NULL DEFAULT 0,
  submissionIsZip BOOLEAN DEFAULT FALSE,
  submissionDate TIMESTAMP,
  submissionStatus VARCHAR(255) NOT NULL DEFAULT 'PENDING',
  FOREIGN KEY (assignmentInfoID) REFERENCES assignmentsinfo(assignmentInfoID) ON DELETE CASCADE
);

-- Create Plagiarism Reports Table
CREATE TABLE plagiarism_reports (
    id SERIAL PRIMARY KEY,
    file1 TEXT NOT NULL,
    file2 TEXT NOT NULL,
    similarity TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Users details.
INSERT INTO users (userName, password, email) VALUES
('user1', '$2b$10$KMyMEvTkDcbx/RYToDC6J.hOBvUmvYHisEQ1IuTWMRHTgbHUvcDc2', 'user1@gmail.com'),
('user2', '$2b$10$04/FozkgIXpZ0J9pyMzUcOpklYN4nQyGh/12XiUyKkvYudTLFFrD.', 'user2@gmail.com'),
('user3', '$2b$10$.MBsgLfokqB6V.K6xTf3QOqTg8MOmXSwy7tdsULse4jb1GeTEpI2G', 'user3@gmail.com'),
('user4', '$2b$10$PiCMrL/cYhzsNZDGjCU0duG/0KCu1OB48h4fAVbXxkpENPYPkkU1q', 'user4@gmail.com'),
('user5', '$2b$10$g0JHRzrxpqXK.ZD1YZATw.T6v3fGUiKzq/6bckerem6XaICJtetbi', 'user5@gmail.com');

-- Insert Assignments with Default File Information
INSERT INTO assignments (userID, title, description, startDate, endDate, difficulty, status, join_code) VALUES
(1, 'Math Homework', 'Solve 10 algebra problems', '2024-02-01', '2024-02-10', 'Medium', 'ACTIVE', 'A12345'),
(2, 'Science Project', 'Build a volcano model', '2024-02-05', '2024-02-15', 'Hard', 'ACTIVE', 'B12345'),
(3, 'History Essay', 'Write about World War II', '2024-02-02', '2024-02-12', 'Medium', 'ACTIVE', 'C12345'),
(4, 'Physics Lab Report', 'Document physics experiments', '2024-02-07', '2024-02-17', 'Hard', 'ACTIVE', 'D12345'),
(5, 'Programming Quiz', 'Solve 5 coding problems', '2024-02-09', '2024-02-19', 'Easy', 'ACTIVE', 'E12345');


-- Insert Assignments Info (Users participating in each other's assignments)
INSERT INTO assignmentsinfo (assignmentID, userID) VALUES
(1, 2), 
(1, 3),
(2, 1),
(2, 4),
(3, 5),
(4, 1),
(4, 3),
(5, 2),
(5, 4);

-- Insert Submissions (Users submitting their work)
INSERT INTO submissions (assignmentInfoID) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9);
