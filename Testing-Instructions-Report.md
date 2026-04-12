# Testing Instructions Report

## 1. Unit Testing

### Current Project Status
- Backend has Jest test script configured in `Backend/package.json`.
- Frontend includes a starter test file in `frontend/src/App.test.js`.

### How to Run Unit Tests
```bash
cd Backend
npm test
```

### Recommended Unit Test Scope
- Controller helper logic
- Middleware behavior (`authMiddleware`, `roleMiddleware`)
- Utility functions
- Model validation rules

## 2. Integration Testing

### Goal
Verify end-to-end interactions among routes, controllers, middleware, and MongoDB.

### Setup
1. Run backend service.
2. Connect to test MongoDB database.
3. Import Postman collection.

### Execution
- Run positive and negative scenarios for all major endpoint groups:
  - Users
  - Promises
  - Politicians
  - Attendance
  - Sessions
  - News
  - Feedback
  - Notifications

### Validate
- HTTP status codes
- Response schema/body
- Authentication/authorization behavior
- Database side effects

## 3. Performance Testing

### Suggested Tool
Artillery (for Express.js APIs)

### Setup
```bash
npm install -g artillery
```

### Example Execution
```bash
artillery quick --count 20 --num 10 https://janaya360-web-development-project.onrender.com/api/promises
```

### Record in Report
- Requests per second
- p95/p99 latency
- Error rate
- Observed bottlenecks

## Testing Environment Configuration
- OS: Windows
- Runtime: Node.js
- Backend: Express.js
- Database: MongoDB Atlas
- API Testing: Postman
- Performance Testing: Artillery
- Frontend: React + Vite

## Evidence Checklist
- [ ] Unit test execution output screenshot
- [ ] Postman integration collection run screenshot
- [ ] Performance run summary screenshot

Store evidence under `docs/testing/`.
