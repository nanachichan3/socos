# Contributing to SOCOS

We love your input! We want to make contributing to SOCOS as easy and transparent as possible.

---

## 🎯 Ways to Contribute

### 🐛 Bug Reports
Found something broken? Open a GitHub issue with:
- Clear description of the bug
- Steps to reproduce
- Your environment (OS, Node version, Docker version)
- Error messages (if any)

### 💡 Feature Requests
Have an idea? Start a Discussion thread with:
- What problem does it solve?
- How would you use it?
- Any mockups or references?

### 🛠️ Code Contributions

**Quick Start:**

```bash
# 1. Fork the repo
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/socos.git
cd socos

# 3. Install dependencies
npm install

# 4. Start the dev environment
docker-compose up

# 5. Open http://localhost:3000
```

**Prerequisites:**
- Docker 20.10+
- Node.js 18+
- PostgreSQL 14+ (via Docker)

**Project Structure:**
```
/apps
  /api          — REST API server
  /web          — React frontend
  /agents       — AI agent services
/packages
  /shared       — Shared types and utilities
  /db           — Database schemas and migrations
/services
  /review-agent — Contact review logic
  /reminder-agent — Notification scheduling
  /enrichment-agent — Context extraction
```

**Development Workflow:**
1. Create a branch (`git checkout -b feature/my-feature`)
2. Make your changes
3. Run tests (`npm run test`)
4. Commit using conventional commits (`git commit -m "feat: add new feature"`)
5. Push and open a PR

**Code Style:**
- TypeScript strict mode
- ESLint + Prettier (run `npm run format` before committing)
- 2-space indentation
- No `any` types

### 📖 Documentation

Help us make the docs better:
- Fix typos and unclear sections
- Add examples and tutorials
- Translate to other languages

### 💬 Community

- Join our [Discord](https://discord.gg/socos)
- Answer questions from other users
- Share how you're using SOCOS

---

## 🔄 Pull Request Process

1. **Fork** the repository and create your branch from `main`
2. **Update docs** if you're changing functionality
3. **Add tests** for any new features (unit or integration)
4. **Ensure tests pass** (`npm run test`)
5. **Update the changelog** if relevant
6. **Submit your PR** — we'll review within 48 hours

---

## 🗺️ Public Roadmap

Check out our [GitHub Projects board](https://github.com/YOUR_ORG/socos/projects) for:
- Currently working on items
- Next up features
- Backlog ideas

Vote on issues with 👍 to help us prioritize.

---

## 📋 Good First Issues

Looking for somewhere to start?
- [ ] Add TypeScript types to undocumented functions
- [ ] Improve error messages in the agent services
- [ ] Write integration tests for the reminder agent
- [ ] Add a dark mode toggle to the web app
- [ ] Improve Docker startup time

---

## ⚖️ Code of Conduct

By participating, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report any unacceptable behavior to **conduct@socos.dev**.

---

## 🔒 Security

Found a security issue? Please report it to **security@socos.dev** instead of opening a public issue.

---

## 📝 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Questions?** Open a Discussion or ping us on Discord. We don't bite.