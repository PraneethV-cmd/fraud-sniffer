DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS assignmentsinfo CASCADE;

CREATE TABLE users (
  userID SERIAL PRIMARY KEY,
  userName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL
);

CREATE TABLE assignments (
  assignmentID SERIAL PRIMARY KEY,
  userID INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  type VARCHAR(255) NOT NULL,
  difficulty VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'ACTIVE',
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE assignmentsinfo (
  assignmentsInfoID SERIAL PRIMARY KEY,
  assignmentID INT NOT NULL,
  userID INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  FOREIGN KEY (assignmentID) REFERENCES assignments(assignmentID) ON DELETE CASCADE,
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);


-- Insert sample users
INSERT INTO users (userName, password, email, role) VALUES
('Alice Smith', 'hashed_password_1', 'alice@example.com', 'teacher'),
('Bob Johnson', 'hashed_password_2', 'bob@example.com', 'student'),
('Charlie Brown', 'hashed_password_3', 'charlie@example.com', 'student');

-- Insert sample assignments
INSERT INTO assignments (userID, title, description, startDate, endDate, type, difficulty, status) VALUES
(1, 'Database Design', 'Design a relational database schema.', '2025-02-01', '2025-02-10', 'Programming', 'Medium', 'ACTIVE'),
(1, 'Software Engineering Report', 'Write a report on Agile methodologies.', '2025-02-05', '2025-02-15', 'Theory', 'Hard', 'ACTIVE');

-- Insert sample assignment submissions (assignmentsinfo)
INSERT INTO assignmentsinfo (assignmentID, userID, status) VALUES
(1, 2, 'SUBMITTED'),
(1, 3, 'PENDING'),
(2, 2, 'PENDING'),
(2, 3, 'SUBMITTED');
