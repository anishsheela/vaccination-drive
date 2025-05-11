# School Vaccination Portal API Documentation

## Overview

The School Vaccination Portal API provides endpoints for managing student vaccinations, including student records, vaccination drives, vaccination recording, and reporting functionality.

**Base URL**: `http://localhost:5001/api`

**Authentication**: JWT Bearer Token (obtained from login endpoint)

## Authentication

All API endpoints except login require authentication using JWT Bearer tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## API Endpoints

### 1. Authentication

#### 1.1 Login
Authenticate user and obtain JWT token.

**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response**: `200 OK`
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "coordinator",
    "name": "School Coordinator"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing username or password
- `401 Unauthorized`: Invalid credentials

---

#### 1.2 Get Current User
Retrieve information about the currently authenticated user.

**Endpoint**: `GET /auth/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "username": "admin",
  "role": "coordinator",
  "name": "School Coordinator",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

---

### 2. Dashboard

#### 2.1 Get Dashboard Statistics
Retrieve overall system statistics.

**Endpoint**: `GET /dashboard/stats`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "total_students": 150,
  "vaccinated_students": 120,
  "vaccination_percentage": 80.0,
  "total_drives": 10,
  "completed_drives": 7
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

#### 2.2 Get Upcoming Drives
Retrieve vaccination drives scheduled within the next 30 days.

**Endpoint**: `GET /dashboard/upcoming-drives`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "vaccine_name": "HPV Vaccine",
    "date": "2024-06-15",
    "available_doses": 100,
    "used_doses": 0,
    "applicable_classes": ["5", "6", "7"],
    "status": "Scheduled",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

### 3. Student Management

#### 3.1 Get Students (Paginated)
Retrieve a paginated list of students with optional search.

**Endpoint**: `GET /students`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `per_page` (integer, optional): Items per page (default: 10)
- `search` (string, optional): Search term for name, ID, or class

**Example**: `/students?page=1&per_page=10&search=john`

**Response**: `200 OK`
```json
{
  "total": 150,
  "pages": 15,
  "current_page": 1,
  "per_page": 10,
  "students": [
    {
      "id": 1,
      "student_id": "ST001",
      "name": "John Doe",
      "class_name": "5",
      "section": "A",
      "age": 10,
      "gender": "Male",
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

#### 3.2 Create Student
Create a new student record.

**Endpoint**: `POST /students`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "student_id": "ST002",
  "name": "Jane Smith",
  "class_name": "5",
  "section": "B",
  "age": 10,
  "gender": "Female"
}
```

**Required Fields**: `student_id`, `name`, `class_name`, `section`
**Optional Fields**: `age`, `gender`

**Response**: `201 Created`
```json
{
  "id": 2,
  "student_id": "ST002",
  "name": "Jane Smith",
  "class_name": "5",
  "section": "B",
  "age": 10,
  "gender": "Female",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields or student ID already exists
- `401 Unauthorized`: Invalid or missing token

---

#### 3.3 Get Student by ID
Retrieve a specific student's details.

**Endpoint**: `GET /students/{id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Student ID

**Response**: `200 OK`
```json
{
  "id": 1,
  "student_id": "ST001",
  "name": "John Doe",
  "class_name": "5",
  "section": "A",
  "age": 10,
  "gender": "Male",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Student not found

---

#### 3.4 Update Student
Update an existing student's information.

**Endpoint**: `PUT /students/{id}`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (integer): Student ID

**Request Body** (all fields optional):
```json
{
  "name": "John Smith",
  "class_name": "6",
  "section": "A",
  "age": 11,
  "gender": "Male"
}
```

**Response**: `200 OK`
```json
{
  "id": 1,
  "student_id": "ST001",
  "name": "John Smith",
  "class_name": "6",
  "section": "A",
  "age": 11,
  "gender": "Male",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-02T00:00:00"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Student not found

---

#### 3.5 Delete Student
Delete a student record.

**Endpoint**: `DELETE /students/{id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Student ID

**Response**: `200 OK`
```json
{
  "message": "Student deleted successfully"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Student not found

---

#### 3.6 Bulk Import Students
Import multiple students from a CSV file.

**Endpoint**: `POST /students/bulk`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body**:
- `file`: CSV file with student data

**CSV Format**:
```csv
student_id,name,class_name,section,age,gender
ST003,Robert Johnson,6,A,11,Male
ST004,Emily Davis,6,B,11,Female
```

**Response**: `200 OK`
```json
{
  "message": "Bulk import completed",
  "success_count": 2,
  "error_count": 0,
  "errors": []
}
```

**Error Responses**:
- `400 Bad Request`: No file uploaded, invalid file format, or missing required columns
- `401 Unauthorized`: Invalid or missing token

---

### 4. Vaccination Drive Management

#### 4.1 Get Vaccination Drives
Retrieve a list of vaccination drives with optional filtering.

**Endpoint**: `GET /drives`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (integer, optional): Page number (default: 1)
- `per_page` (integer, optional): Items per page (default: 10)
- `status` (string, optional): Filter by status (Scheduled, Completed, Cancelled)

**Example**: `/drives?page=1&per_page=10&status=Scheduled`

**Response**: `200 OK`
```json
{
  "total": 5,
  "pages": 1,
  "current_page": 1,
  "per_page": 10,
  "drives": [
    {
      "id": 1,
      "vaccine_name": "HPV Vaccine",
      "date": "2024-06-15",
      "available_doses": 100,
      "used_doses": 0,
      "applicable_classes": ["5", "6", "7"],
      "status": "Scheduled",
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

#### 4.2 Create Vaccination Drive
Schedule a new vaccination drive.

**Endpoint**: `POST /drives`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "vaccine_name": "HPV Vaccine",
  "date": "2024-06-15",
  "available_doses": 100,
  "applicable_classes": ["5", "6", "7"]
}
```

**Required Fields**: All fields are required

**Business Rules**:
- Date must be at least 15 days in the future
- No other drive can be scheduled on the same date

**Response**: `201 Created`
```json
{
  "id": 1,
  "vaccine_name": "HPV Vaccine",
  "date": "2024-06-15",
  "available_doses": 100,
  "used_doses": 0,
  "applicable_classes": ["5", "6", "7"],
  "status": "Scheduled",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `400 Bad Request`: Missing fields, date validation error, or conflicting drive
- `401 Unauthorized`: Invalid or missing token

---

#### 4.3 Get Drive by ID
Retrieve details of a specific vaccination drive.

**Endpoint**: `GET /drives/{id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Drive ID

**Response**: `200 OK`
```json
{
  "id": 1,
  "vaccine_name": "HPV Vaccine",
  "date": "2024-06-15",
  "available_doses": 100,
  "used_doses": 25,
  "applicable_classes": ["5", "6", "7"],
  "status": "Scheduled",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Drive not found

---

#### 4.4 Update Vaccination Drive
Update an existing vaccination drive.

**Endpoint**: `PUT /drives/{id}`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameters**:
- `id` (integer): Drive ID

**Request Body** (all fields optional):
```json
{
  "vaccine_name": "HPV Vaccine Updated",
  "date": "2024-06-20",
  "available_doses": 150,
  "applicable_classes": ["5", "6", "7", "8"],
  "status": "Scheduled"
}
```

**Business Rules**:
- Cannot edit past drives
- Cannot edit completed drives
- Date must be at least 15 days in the future if changing date

**Response**: `200 OK`
```json
{
  "id": 1,
  "vaccine_name": "HPV Vaccine Updated",
  "date": "2024-06-20",
  "available_doses": 150,
  "used_doses": 25,
  "applicable_classes": ["5", "6", "7", "8"],
  "status": "Scheduled",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-02T00:00:00"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors or business rule violations
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Drive not found

---

#### 4.5 Delete Vaccination Drive
Delete a vaccination drive.

**Endpoint**: `DELETE /drives/{id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Drive ID

**Business Rules**:
- Cannot delete past drives
- Cannot delete completed drives

**Response**: `200 OK`
```json
{
  "message": "Vaccination drive deleted successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Cannot delete past or completed drives
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Drive not found

---

### 5. Vaccination Records

#### 5.1 Record Vaccination
Record a vaccination for a student.

**Endpoint**: `POST /vaccinations`

**Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "student_id": 1,
  "drive_id": 1
}
```

**Business Rules**:
- Student must exist
- Drive must exist
- Drive must have available doses
- Student's class must be eligible for the drive
- Student must not be already vaccinated in this drive

**Response**: `201 Created`
```json
{
  "id": 1,
  "student_id": 1,
  "drive_id": 1,
  "vaccine_name": "HPV Vaccine",
  "student_name": "John Doe",
  "date": "2024-01-15",
  "status": "Completed",
  "created_at": "2024-01-15T00:00:00",
  "updated_at": "2024-01-15T00:00:00"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors or business rule violations
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Student or drive not found

---

#### 5.2 Get Vaccination Records
Retrieve vaccination records with optional filtering.

**Endpoint**: `GET /vaccinations`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `student_id` (integer, optional): Filter by student ID
- `drive_id` (integer, optional): Filter by drive ID

**Example**: `/vaccinations?student_id=1`

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "student_id": 1,
    "drive_id": 1,
    "vaccine_name": "HPV Vaccine",
    "student_name": "John Doe",
    "date": "2024-01-15",
    "status": "Completed",
    "created_at": "2024-01-15T00:00:00",
    "updated_at": "2024-01-15T00:00:00"
  }
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

#### 5.3 Delete Vaccination Record
Delete a vaccination record.

**Endpoint**: `DELETE /vaccinations/{id}`

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
- `id` (integer): Vaccination record ID

**Response**: `200 OK`
```json
{
  "message": "Vaccination record deleted successfully"
}
```

**Side Effects**:
- Updates the available doses count in the associated drive

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: Vaccination record not found

---

### 6. Reports

#### 6.1 Get Vaccination Report
Generate a vaccination report with optional filters.

**Endpoint**: `GET /reports/vaccinations`

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `vaccine_name` (string, optional): Filter by vaccine name
- `class_name` (string, optional): Filter by class
- `start_date` (string, optional): Start date (YYYY-MM-DD)
- `end_date` (string, optional): End date (YYYY-MM-DD)
- `download` (boolean, optional): Download as CSV file

**Example**: `/reports/vaccinations?vaccine_name=HPV&class_name=5&start_date=2024-01-01&end_date=2024-12-31`

**Response**: `200 OK`
```json
{
  "count": 50,
  "records": [
    {
      "record_id": 1,
      "student_id": "ST001",
      "student_name": "John Doe",
      "class_name": "5",
      "section": "A",
      "vaccine_name": "HPV Vaccine",
      "vaccination_date": "2024-01-15",
      "status": "Completed"
    }
  ]
}
```

**Response when download=true**: CSV file download

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: No records found (when download=true)

---

#### 6.2 Get Vaccines List
Retrieve a list of all vaccine names in the system.

**Endpoint**: `GET /reports/vaccines`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
[
  "HPV Vaccine",
  "Flu Vaccine",
  "COVID-19 Vaccine",
  "MMR Vaccine"
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

#### 6.3 Get Classes List
Retrieve a list of all class names in the system.

**Endpoint**: `GET /reports/classes`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
[
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
]
```

**Error Responses**:
- `401 Unauthorized`: Invalid or missing token

---

## Error Handling

### Standard Error Response Format
All error responses follow this format:

```json
{
  "error": "Descriptive error message"
}
```

### HTTP Status Codes
- `200 OK`: Successful request
- `201 Created`: Successfully created resource
- `400 Bad Request`: Invalid request or validation error
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Request understood but contains invalid data

### Common Error Messages
- "Username and password are required"
- "Invalid credentials"
- "Student ID already exists"
- "Student not found"
- "Vaccination drive not found"
- "No available doses left for this drive"
- "Student already vaccinated in this drive"
- "Cannot edit past vaccination drives"
- "Vaccination drive must be scheduled at least 15 days in advance"

---

## Data Formats

### Date Format
All dates use the ISO 8601 format: `YYYY-MM-DD`

Example: `2024-06-15`

### DateTime Format
All timestamps use the ISO 8601 format: `YYYY-MM-DDTHH:MM:SS`

Example: `2024-01-01T14:30:00`

### CSV Format for Student Import
```csv
student_id,name,class_name,section,age,gender
ST001,John Doe,5,A,10,Male
ST002,Jane Smith,5,B,10,Female
```

Required columns: `student_id`, `name`, `class_name`, `section`
Optional columns: `age`, `gender`

