# Contributing to Team Task Manager

Welcome! We're excited you want to contribute to Team Task Manager. This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and professional
- Help others learn and grow
- Accept constructive criticism
- Focus on what's best for the community

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear description of the bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/error logs if applicable
   - Your environment (OS, Node version, etc.)

### Suggesting Features

1. Open a new issue with the label "enhancement"
2. Describe the feature and why it's needed
3. Explain the user benefit
4. Provide mockups or examples if applicable

### Submitting Code Changes

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Team-Task-Manager.git
   cd Team-Task-Manager
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow code style guidelines
   - Add comments for complex logic
   - Update relevant documentation

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend && npm test
   
   # Frontend tests
   cd frontend && npm test
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add feature: brief description"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Link related issues
   - Describe changes and motivation
   - Add screenshots for UI changes
   - Request review from maintainers

## Development Setup

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Git

### Initial Setup
```bash
# Clone repository
git clone https://github.com/ABHISHEKKUMAR72/Team-Task-Manager.git
cd Team-Task-Manager

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Frontend setup
cd frontend
npm install
```

### Running Development Environment
```bash
# Using Docker Compose (Recommended)
docker-compose up -d

# Or manually
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

## Code Style Guidelines

### JavaScript/ES6
- Use semicolons at end of statements
- Use single quotes for strings
- Use arrow functions where appropriate
- Use const/let, avoid var
- Max line length: 100 characters
- Use camelCase for variables/functions
- Use PascalCase for classes/components

### React
- Use functional components with hooks
- Use PropTypes or TypeScript for type checking
- Keep components small and focused
- Use descriptive component names
- Separate concerns into custom hooks
- Use Context API for state management

### Backend
- Use middleware for cross-cutting concerns
- Keep controllers thin, logic in models/utils
- Use async/await, avoid callbacks
- Handle errors consistently
- Add validation for all inputs
- Use meaningful variable names

### CSS
- Use CSS classes (not inline styles)
- Follow BEM naming convention
- Mobile-first responsive design
- Use CSS variables for colors/sizes
- Keep specificity low
- Organize by component

## Testing Guidelines

### Unit Tests
```javascript
// Test individual functions
describe('hashPassword', () => {
  it('should hash password correctly', async () => {
    const password = 'test123';
    const hash = await hashPassword(password);
    expect(hash).not.toBe(password);
  });
});
```

### Integration Tests
```javascript
// Test API endpoints
describe('POST /api/auth/signup', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        password: 'password123'
      });
    expect(response.status).toBe(201);
  });
});
```

## Commit Message Format

```
[TYPE] Brief description (50 chars max)

Detailed explanation (wrap at 72 chars)
- Bullet point if needed
- Another point

Fixes #123
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test changes
- `chore`: Maintenance

## Documentation

### Updating Docs
- Update README.md for user-facing changes
- Update API_DOCS.md for API changes
- Update TECH_SPEC.md for architecture changes
- Add comments for complex code

### Creating New Docs
- Use Markdown format
- Include examples where applicable
- Add table of contents for long documents
- Update file links to reflect changes

## Pull Request Process

1. **Before submitting:**
   - Run tests locally
   - Check code style
   - Update documentation
   - Test in both dev and prod configs

2. **In PR description:**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Motivation
   Why is this change needed?
   
   ## Changes Made
   - Change 1
   - Change 2
   
   ## Related Issues
   Fixes #123
   
   ## Testing
   How to test the changes
   
   ## Screenshots
   (if UI changes)
   ```

3. **After submission:**
   - Address code review feedback
   - Re-request review after changes
   - Merge after approval

## Performance Considerations

When submitting code, consider:

### Backend
- Query optimization (avoid N+1)
- Database indexing
- Caching strategies
- Request validation efficiency

### Frontend
- Component rendering efficiency
- Bundle size impact
- Asset loading
- State management overhead

## Security Considerations

### Never commit:
- API keys or secrets
- Database credentials
- Sensitive personal data
- Private tokens

### Always:
- Validate user input
- Use parameterized queries
- Hash sensitive data
- Use HTTPS in production
- Follow OWASP guidelines

## Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [Express.js Guide](https://expressjs.com/guide.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Git Workflow](https://git-scm.com/book/en/v2)

## Getting Help

- **Issues**: Use GitHub issues for bugs/features
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check README.md and TECH_SPEC.md first
- **Community**: Join our community discussions

## License

By contributing, you agree your code will be licensed under the MIT License.

## Additional Notes

- Start small with minor fixes/features
- Comment your code for maintainability
- Be patient with the review process
- Learn from feedback and improve
- Help review others' PRs too!

---

Thank you for contributing to Team Task Manager! 🎉

We appreciate your time and effort to make this project better.
