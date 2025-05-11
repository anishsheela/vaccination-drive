# School Vaccination Portal - System Overview Document

## Executive Summary

The School Vaccination Portal is a comprehensive web-based system designed to streamline and manage vaccination processes in educational institutions. This system enables school coordinators to efficiently track student vaccination records, schedule vaccination drives, monitor compliance rates, and generate detailed reports. Built with modern web technologies, the system provides a user-friendly interface while maintaining robust data security and integrity.

## System Purpose and Objectives

### Primary Purpose
To digitize and automate the management of school vaccination programs, replacing manual record-keeping with an efficient, centralized system that ensures accurate tracking and reporting of student immunization status.

### Key Objectives
1. **Streamline Vaccination Management**: Automate the scheduling and tracking of vaccination drives
2. **Improve Data Accuracy**: Eliminate manual entry errors and maintain accurate student health records
3. **Enhance Reporting Capabilities**: Generate comprehensive reports for health authorities and school administration
4. **Ensure Compliance**: Track vaccination compliance rates and identify unvaccinated students
5. **Facilitate Decision-Making**: Provide real-time statistics and analytics for administrators

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React)                      │
├─────────────────────────────────────────────────────────────┤
│                    API Layer (REST)                         │
├─────────────────────────────────────────────────────────────┤
│              Business Logic Layer (Flask)                    │
├─────────────────────────────────────────────────────────────┤
│               Data Access Layer (SQLAlchemy)                 │
├─────────────────────────────────────────────────────────────┤
│                  Database Layer (SQLite)                     │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Frontend (React)
- **Presentation Layer**: React components for UI rendering
- **State Management**: React Context API for authentication
- **Routing**: React Router for navigation
- **API Communication**: Axios for HTTP requests
- **UI Framework**: React Bootstrap for responsive design
- **Data Visualization**: Chart.js for statistical graphs

#### Backend (Flask)
- **API Layer**: RESTful endpoints
- **Authentication**: JWT-based authentication
- **Business Logic**: Service layer for complex operations
- **Data Validation**: Request validation and error handling
- **ORM**: SQLAlchemy for database operations
- **Security**: Password hashing, token management

#### Database
- **RDBMS**: SQLite (development) / PostgreSQL (production)
- **Schema Design**: Normalized relational database
- **Data Integrity**: Foreign key constraints and validations

## System Components

### 1. Authentication Module
**Purpose**: Secure user access and session management

**Features**:
- JWT-based authentication
- Session management
- Password encryption
- Token expiration handling

**Components**:
- Login interface
- Authentication service
- JWT token management
- Protected route guards

### 2. Student Management Module
**Purpose**: Comprehensive student record management

**Features**:
- Student CRUD operations
- Bulk import via CSV
- Search and filtering
- Pagination
- Student details view

**Components**:
- Student list view
- Student form (create/edit)
- CSV import interface
- Student details dashboard

### 3. Vaccination Drive Management Module
**Purpose**: Plan and manage vaccination drives

**Features**:
- Schedule vaccination drives
- Manage vaccine inventory
- Define eligible classes
- Track drive status
- Prevent scheduling conflicts

**Components**:
- Drive list view
- Drive creation form
- Drive details view
- Calendar integration

### 4. Vaccination Recording Module
**Purpose**: Record individual student vaccinations

**Features**:
- Student search functionality
- Eligibility verification
- Dose availability checking
- Real-time updates
- Duplicate prevention

**Components**:
- Vaccination recording form
- Student selection interface
- Drive selection interface
- Validation alerts

### 5. Reporting Module
**Purpose**: Generate comprehensive reports and analytics

**Features**:
- Vaccination coverage reports
- Filter by multiple criteria
- CSV export functionality
- Visual statistics
- Compliance tracking

**Components**:
- Report generation interface
- Filter controls
- Export functionality
- Data visualization charts

### 6. Dashboard Module
**Purpose**: Provide system overview and quick access

**Features**:
- Key metrics display
- Visual charts
- Upcoming drives preview
- Quick navigation links
- Real-time statistics

**Components**:
- Statistics cards
- Chart components
- Drive preview table
- Navigation menu

## Data Model

### Core Entities

#### 1. User
- Stores system user information
- Fields: id, username, password_hash, role, name
- Relationships: None

#### 2. Student
- Maintains student records
- Fields: id, student_id, name, class_name, section, age, gender
- Relationships: Has many vaccination records

#### 3. VaccinationDrive
- Manages vaccination drive information
- Fields: id, vaccine_name, date, available_doses, used_doses, applicable_classes, status
- Relationships: Has many vaccination records

#### 4. VaccinationRecord
- Records individual vaccinations
- Fields: id, student_id, drive_id, date, status
- Relationships: Belongs to Student and VaccinationDrive

### Entity Relationship Diagram

```
┌─────────────────┐     ┌──────────────────────┐
│     Student     │     │  VaccinationDrive    │
├─────────────────┤     ├──────────────────────┤
│ id              │     │ id                   │
│ student_id      │     │ vaccine_name         │
│ name            │     │ date                 │
│ class_name      │     │ available_doses      │
│ section         │     │ used_doses           │
│ age             │     │ applicable_classes   │
│ gender          │     │ status               │
└────────┬────────┘     └──────────┬───────────┘
         │                         │
         │                         │
         │    ┌─────────────────┐  │
         │    │ VaccinationRecord  │
         │    ├─────────────────┤  │
         └────┤ id              ├──┘
              │ student_id (FK) │
              │ drive_id (FK)   │
              │ date            │
              │ status          │
              └─────────────────┘
```

## Business Rules and Validations

### 1. Vaccination Drive Rules
- Drives must be scheduled at least 15 days in advance
- No two drives can be scheduled on the same date
- Past drives cannot be edited or deleted
- Completed drives cannot be modified

### 2. Student Vaccination Rules
- Students can only be vaccinated if their class is eligible
- One vaccination per student per drive
- Vaccination only possible if doses are available
- Cannot record vaccination for non-existent students/drives

### 3. Data Integrity Rules
- Student IDs must be unique
- All required fields must be provided
- Age must be within valid school range (4-20)
- Date formats must be YYYY-MM-DD

### 4. Access Control Rules
- All operations require authentication
- JWT tokens expire after 1 hour
- Passwords must be securely hashed
- Session management through token validation

## User Roles and Permissions

### School Coordinator (Primary User)
**Permissions**:
- Full system access
- Student management (CRUD)
- Drive management (CRUD)
- Vaccination recording
- Report generation
- Dashboard access

**Restrictions**:
- Cannot modify completed drives
- Cannot delete past drives
- Cannot duplicate vaccinations

## System Workflows

### 1. Student Registration Workflow
1. Coordinator logs into system
2. Navigates to student management
3. Enters student details or uploads CSV
4. System validates data
5. Student records created
6. Confirmation displayed

### 2. Vaccination Drive Scheduling Workflow
1. Coordinator accesses drive management
2. Creates new drive with details
3. System validates date (15+ days advance)
4. System checks for conflicts
5. Drive scheduled and saved
6. Appears in upcoming drives

### 3. Vaccination Recording Workflow
1. Coordinator opens vaccination recording
2. Searches and selects student
3. Selects vaccination drive
4. System validates eligibility
5. System checks dose availability
6. Vaccination recorded
7. Drive doses updated

### 4. Report Generation Workflow
1. Coordinator accesses reports section
2. Selects filters (vaccine, class, date range)
3. System queries database
4. Report generated with statistics
5. Option to export as CSV
6. Download initiated

## Security Measures

### 1. Authentication Security
- JWT token-based authentication
- Bcrypt password hashing
- Token expiration (1 hour)
- Secure session management

### 2. Data Protection
- Input validation and sanitization
- SQL injection prevention (ORM)
- XSS protection
- CORS configuration

### 3. Access Control
- Route protection
- API endpoint authentication
- Role-based access control
- Token validation middleware

### 4. Data Privacy
- Encrypted password storage
- Secure data transmission
- No sensitive data in logs
- Protected student information

## System Integration Points

### 1. External Systems
- No current external integrations
- Future potential: Government health databases
- Future potential: School management systems

### 2. Data Import/Export
- CSV import for student data
- CSV export for reports
- JSON API responses
- Standard data formats

### 3. Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile devices
- Progressive web app capabilities

## Performance Considerations

### 1. Database Optimization
- Indexed queries
- Pagination for large datasets
- Optimized relationships
- Query caching

### 2. Frontend Performance
- Component lazy loading
- Optimized re-renders
- Efficient state management
- Asset optimization

### 3. API Performance
- Request throttling
- Response caching
- Minimal data transfer
- Efficient queries

## Deployment Architecture

### Development Environment
- Local development servers
- SQLite database
- Debug mode enabled
- Hot module replacement

### Production Environment
- Web server (Nginx)
- Application server (Gunicorn)
- PostgreSQL database
- SSL/TLS encryption
- Load balancing (optional)

### Deployment Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Web Browser   │────▶│   Nginx Server   │────▶│  React Static   │
│    (Client)     │     │  (Reverse Proxy) │     │     Files       │
└─────────────────┘     └────────┬─────────┘     └─────────────────┘
                                 │
                                 │
                                 ▼
                        ┌─────────────────┐
                        │    Gunicorn     │
                        │  (WSGI Server)  │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   Flask App     │
                        └────────┬────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │   PostgreSQL    │
                        │    Database     │
                        └─────────────────┘
```

## Monitoring and Maintenance

### 1. System Monitoring
- Application logs
- Error tracking
- Performance metrics
- Database monitoring

### 2. Backup Procedures
- Daily database backups
- Configuration backups
- Code repository backups
- Disaster recovery plan

### 3. Maintenance Tasks
- Regular updates
- Security patches
- Database optimization
- Performance tuning

## Future Enhancements

### 1. Feature Enhancements
- Mobile application
- SMS/Email notifications
- Multi-school support
- Parent portal access

### 2. Integration Possibilities
- Government health systems
- School management systems
- Medical record systems
- Notification services

### 3. Scalability Options
- Microservices architecture
- Distributed databases
- Cloud deployment
- API gateway implementation

## System Limitations

### 1. Current Limitations
- Single school support only
- No real-time notifications
- Limited reporting formats
- Basic user roles

### 2. Technical Constraints
- Browser dependency
- Internet connectivity required
- Limited offline capabilities
- Single database instance

## Conclusion

The School Vaccination Portal provides a robust, secure, and user-friendly solution for managing school vaccination programs. With its modular architecture, comprehensive features, and strong security measures, the system effectively addresses the challenges of manual vaccination tracking while providing valuable insights through reporting and analytics. The system's design allows for future scalability and enhancement to meet evolving requirements in school health management.

