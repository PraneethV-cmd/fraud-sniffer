
## API Endpoints


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

## DO READDDD

Slight modifications have been done to the end point for now, the create assignment is 

 /create 

request is multi form data, where the 
key for file: assignment and content-type automatic 
key for other fields, otherfiles, content-type "text/plain", value = JSON 

uploading is working, downloading not working sometimes, no clue 
