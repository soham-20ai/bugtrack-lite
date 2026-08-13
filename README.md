# BugTrack Lite

BugTrack Lite is a small issue-tracking web application created as a portfolio project to demonstrate JavaScript fundamentals, REST APIs, Git, and automated software testing.

## Features

- Create bugs with title, description, priority, status, and assignee
- Search bugs
- Filter by status and priority
- Update bug status
- Delete bugs
- REST API with Express
- Unit tests with Jest
- Integration/API tests with Jest + Supertest
- End-to-end test with Playwright
- Input validation and edge-case testing
- Responsive UI

## Tech Stack

- HTML, CSS, JavaScript
- Node.js
- Express
- Jest
- Supertest
- Playwright
- Git/GitHub

## Project Structure

```text
bugtrack-lite/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   └── bugService.js
├── tests/
│   ├── bugService.test.js
│   ├── api.test.js
│   └── e2e/
│       └── bugtrack.spec.js
├── server.js
├── playwright.config.js
├── package.json
└── README.md
```

## Run Locally

```bash
npm install
npm start
```

Open:

```text
http://localhost:3000
```

## Run Unit + Integration Tests

```bash
npm test
```

## Run E2E Tests

Install Playwright browsers once:

```bash
npx playwright install
```

Then:

```bash
npm run test:e2e
```

## Testing Strategy

### Unit Testing
The bug service is tested in isolation. Examples include validation, creation, updating, filtering, and deletion.

### Integration Testing
The Express API is tested through HTTP requests using Supertest. These tests verify that routes, validation, and the service layer work together.

### End-to-End Testing
Playwright simulates a real user creating a critical bug through the browser and verifies that the new issue appears on the dashboard.

## Future Improvements

- MongoDB persistence
- User authentication and roles
- Comments and activity history
- File attachments
- Email notifications for critical bugs
- CI/CD pipeline with GitHub Actions
- Code coverage reporting

## Portfolio Note

The application intentionally uses an in-memory data store to keep the project easy to run and focused on the testing workflow. A production version would use a persistent database.
