DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS assignmentsinfo CASCADE;
DROP TABLE IF EXISTS submissions CASCADE;
DROP TABLE IF EXISTS plagiarism_reports CASCADE;

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
  startDate TIMESTAMP NOT NULL,
  endDate TIMESTAMP NOT NULL,
  difficulty VARCHAR(255) NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'ACTIVE',
  filename TEXT NOT NULL DEFAULT 'no_file',
  originalFilename TEXT NOT NULL DEFAULT 'no_file',
  filePath TEXT NOT NULL DEFAULT '',
  fileType VARCHAR(50) NOT NULL DEFAULT 'unknown',
  fileSize BIGINT NOT NULL DEFAULT 0,
  isZip BOOLEAN DEFAULT FALSE,
  uploadDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE assignmentsinfo (
  assignmentInfoID SERIAL PRIMARY KEY,
  assignmentID INT NOT NULL,
  userID INT NOT NULL,
  status VARCHAR(255) NOT NULL,
  FOREIGN KEY (assignmentID) REFERENCES assignments(assignmentID) ON DELETE CASCADE,
  FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE
);

CREATE TABLE submissions (
  submissionID SERIAL PRIMARY KEY,
  assignmentInfoID INT NOT NULL,
  filename TEXT NOT NULL DEFAULT 'no_file',
  originalFilename TEXT NOT NULL DEFAULT 'no_file',
  filePath TEXT NOT NULL DEFAULT '',
  fileType VARCHAR(50) NOT NULL DEFAULT 'unknown',
  fileSize BIGINT NOT NULL DEFAULT 0,
  isZip BOOLEAN DEFAULT FALSE,
  submissionDate TIMESTAMP NOT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'Pending',
  FOREIGN KEY (assignmentInfoID) REFERENCES assignmentsinfo(assignmentInfoID) ON DELETE CASCADE
);

CREATE TABLE plagiarism_reports (
    id SERIAL PRIMARY KEY,
    file1 TEXT NOT NULL,
    file2 TEXT NOT NULL,
    similarity TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Users
INSERT INTO users (userName, password, email, role) VALUES
('Alice', 'password1', 'alice@example.com', 'student'),
('Bob', 'password2', 'bob@example.com', 'student'),
('Charlie', 'password3', 'charlie@example.com', 'student'),
('David', 'password4', 'david@example.com', 'instructor'),
('Emma', 'password5', 'emma@example.com', 'student');

-- Insert Assignments with Default File Information
INSERT INTO assignments (userID, title, description, startDate, endDate, difficulty, status) VALUES
(1, 'Math Homework', 'Solve 10 algebra problems', '2024-02-01', '2024-02-10', 'Medium', 'ACTIVE'),
(2, 'Science Project', 'Build a volcano model', '2024-02-05', '2024-02-15', 'Hard', 'ACTIVE'),
(3, 'History Essay', 'Write about World War II', '2024-02-02', '2024-02-12', 'Medium', 'ACTIVE'),
(4, 'Physics Lab Report', 'Document physics experiments', '2024-02-07', '2024-02-17', 'Hard', 'ACTIVE'),
(5, 'Programming Quiz', 'Solve 5 coding problems', '2024-02-09', '2024-02-19', 'Easy', 'ACTIVE');

-- Insert Assignments Info (Users participating in each other's assignments)
INSERT INTO assignmentsinfo (assignmentID, userID, status) VALUES
(1, 2, 'IN_PROGRESS'), -- Bob is participating in Alice's assignment
(1, 3, 'COMPLETED'),   -- Charlie is participating in Alice's assignment
(2, 1, 'IN_PROGRESS'), -- Alice is participating in Bob's assignment
(2, 4, 'COMPLETED'),   -- David is participating in Bob's assignment
(3, 5, 'PENDING'),     -- Emma is participating in Charlie's assignment
(4, 1, 'IN_PROGRESS'), -- Alice is participating in David's assignment
(4, 3, 'IN_PROGRESS'), -- Charlie is participating in David's assignment
(5, 2, 'COMPLETED'),   -- Bob is participating in Emma's assignment
(5, 4, 'PENDING');     -- David is participating in Emma's assignment

-- Insert Submissions (Users submitting their work)
INSERT INTO submissions (assignmentInfoID, submissionDate) VALUES
(1, '2024-02-08'), -- Bob submitted Alice's assignment
(2, '2024-02-09'), -- Charlie submitted Alice's assignment
(3, '2024-02-12'), -- Alice submitted Bob's assignment
(4, '2024-02-13'), -- David submitted Bob's assignment
(5, '2024-02-15'), -- Emma submitted Charlie's assignment
(6, '2024-02-16'), -- Alice submitted David's assignment
(7, '2024-02-18'); -- Charlie submitted David's assignment

