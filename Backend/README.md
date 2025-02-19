================

## API Endpoints

================

### CREATE ASSIGNMENT - PUT /assignment

- Request Body:
- `userId` (string, required): The userID of the assignment owner
- `title` (string, required): The title of the assignment
- `endDate` (string, required): The due date of the assignment
- `description` (string, required): The description of the assignment

### UPDATE ASSIGNMENT - POST /assignment/{assignmentID}

- Request Body:
- `title` (string, required): The title of the assignment
- `endDate` (string, required): The due date of the assignment
- `description` (string, required): The description of the assignment

### DELETE ASSIGNMENT - DELETE /assignment/{assignmentID}

- Request Body: None

### GET ASSIGNMENT - GET /assignment/{assignmentID}

- Request Body: None

### VIEW USER ASSIGNMENT - GET /assignment/view?userID={userID}&type={type}

- Query Params:
- `userID` (string, required): The userID of the user to view assignments for
- `type` (string, required): The type of assignment to view (e.g. "owner", "participant")
