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


INSERT INTO users (userName, password, email, role) VALUES ('Lowkik', 'lowkiksai', 'lowkiksaipotnuru@gmail.com', 'Teacher');