# TypeScript Monorepo Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-10.10.0-orange.svg)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-1.13.3-blueviolet.svg)](https://turbo.build/)

A complete TypeScript monorepo template with Next.js, React (Vite), Nest.js, and shared packages. Includes Docker configurations, ESLint, TypeScript configs, and Turborepo setup.

## 🎬 Getting Started

### Clone and Set Up Your Repository

```bash
# Clone the repository
git clone https://github.com/yevgeniusr/ts-monorepo-boilerplate.git your-project-name
cd your-project-name

# Remove the existing remote
git remote remove origin

# Add your own remote repository
git remote add origin https://github.com/your-username/your-repo-name.git

# (Optional) Push to your new remote
git push -u origin main
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Run tests
pnpm test
```

## 📁 Project Structure

```
ts-monorepo-boilerplate/
├── apps/
│   ├── nextjs-app/          # Next.js 14 application
│   └── react-app/           # React + Vite application
├── services/
│   └── nestjs-service/      # Nest.js backend service
├── packages/
│   ├── shared-package/      # Shared TypeScript package
│   ├── eslint-config/       # Shared ESLint configurations
│   └── typescript-config/   # Shared TypeScript configurations
├── configs/                 # Configuration templates
│   ├── eslint/
│   ├── typescript/
│   └── prettier/
├── docker/                  # Dockerfiles for deployment
├── package.json             # Root package configuration
├── turbo.json               # Turborepo pipeline config
└── pnpm-workspace.yaml      # PNPM workspace config
```

## ✨ Features

- **Next.js App** - Next.js 14 with TypeScript, Tailwind CSS, ESLint, and Vitest
- **React App** - Vite-based React app with TypeScript, Tailwind CSS, ESLint, and Vitest
- **Nest.js Service** - Complete Nest.js backend with TypeScript, Jest, and ESLint
- **Shared Packages** - Reusable TypeScript packages for shared code
- **Docker Support** - Dockerfiles for backend, Next.js, and Vite apps
- **Code Quality** - ESLint, Prettier, and TypeScript configurations
- **Build System** - Turborepo for optimized builds and caching

## 🛠️ Available Scripts

### Root Level

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps/services in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all code |
| `pnpm test` | Run all tests |
| `pnpm type:check` | Type check all TypeScript code |
| `pnpm format` | Format all code with Prettier |
| `pnpm clean` | Clean all build artifacts |

### App/Service Level

Each app/service has its own scripts in their `package.json`:
- `dev` - Development mode
- `build` - Production build
- `lint` - Lint code
- `test` - Run tests
- `type:check` - Type check

## 🔧 Customization

Before using this boilerplate, replace these placeholders throughout the codebase:

### Keywords to Replace

1. **`ts-monorepo-boilerplate`** → Your project name
   - Used in: package names, workspace references, app titles
   
2. **`@ts-monorepo-boilerplate/*`** → Your package scope
   - Used in: all package.json files, import statements
   - Example: `@ts-monorepo-boilerplate/shared-package` → `@my-project/shared-package`

3. **`TypeScript Monorepo Boilerplate`** → Your project description
   - Used in: package.json descriptions

4. **`yevgeniusr`** → Your name/username
   - Used in: package.json author field

### Quick Find & Replace

Use your IDE's find-and-replace (case-sensitive) to replace:
- `ts-monorepo-boilerplate` → `your-project-name`
- `@ts-monorepo-boilerplate` → `@your-scope`
- `TypeScript Monorepo Boilerplate` → `Your Project Description`
- `yevgeniusr` → `Your Name`

## 📦 Adding New Packages

### Adding a New App

1. Copy an existing app folder (e.g., `apps/nextjs-app/`)
2. Rename it to your app name
3. Update `package.json` with your app name
4. Update import paths in `tsconfig.json` if needed

### Adding a New Service

1. Copy `services/nestjs-service/` to `services/your-service-name/`
2. Update `package.json` with your service name
3. Update Dockerfile if using (in `docker/` folder)

### Adding a New Shared Package

1. Copy `packages/shared-package/` to `packages/your-package-name/`
2. Update `package.json` with your package name
3. Update imports in apps/services that use this package

## 🐳 Docker

Dockerfiles are available in the `docker/` folder:

- `Dockerfile.backend` - For Nest.js services
- `Dockerfile.web` - For Next.js applications
- `Dockerfile.frontend` - For Vite/React applications

Update the Dockerfiles with your actual service/app names before use.

## ⚙️ Configuration

### ESLint

ESLint configurations are provided for:
- **Next.js apps** - Uses Vercel's style guide
- **Services** - Node.js backend configuration
- **Libraries** - Shared package configuration

All configs extend from `@ts-monorepo-boilerplate/eslint-config`.

### TypeScript

TypeScript configurations are provided for:
- **Base** - Common settings for all projects
- **Next.js** - Next.js-specific settings
- **Service** - Backend service settings
- **Library** - Shared package settings

### Turborepo

The `turbo.json` includes pipelines for:
- `build` - Builds all packages/apps/services
- `lint` - Lints all code
- `test` - Runs tests
- `type:check` - Type checks TypeScript
- `dev` - Development mode (no caching)
- `clean` - Cleans build artifacts

## 🐛 Troubleshooting

### TypeScript Errors

If you see TypeScript errors about missing types:
1. Ensure `@ts-monorepo-boilerplate/typescript-config` is installed
2. Check that `tsconfig.json` extends the correct config
3. Run `pnpm install` to ensure all dependencies are linked

### ESLint Errors

If ESLint can't find configs:
1. Ensure `@ts-monorepo-boilerplate/eslint-config` is installed
2. Check that `.eslintrc.cjs` extends the correct config
3. Verify the eslint-config package exports the right files

### Build Errors

If builds fail:
1. Check that all workspace dependencies are installed
2. Verify `pnpm-workspace.yaml` includes all package paths
3. Ensure `turbo.json` pipeline is correctly configured

## 📝 Best Practices

1. **Always update placeholders** - Replace all boilerplate names with your project names
2. **Keep configs in sync** - When updating shared configs, ensure all apps/services use them
3. **Use workspace protocol** - Always use `workspace:*` for internal package dependencies
4. **Test after setup** - Run `pnpm install` and `pnpm build` to verify everything works

## 🎯 Next Steps

After setting up your monorepo:

1. ✅ Replace all placeholder names and keywords
2. ✅ Add your application code to the respective app/service folders
3. ✅ Configure environment variables (`.env` files)
4. ✅ Set up CI/CD pipelines
5. ✅ Configure deployment (Docker, Vercel, etc.)
6. ✅ Add additional packages/services as needed

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Tech Stack

- **Package Manager**: pnpm 10.10.0
- **Build System**: Turborepo 1.13.3
- **Language**: TypeScript 5.4
- **Frontend**: Next.js 14, React, Vite
- **Backend**: Nest.js
- **Styling**: Tailwind CSS
- **Testing**: Vitest, Jest
- **Linting**: ESLint, Prettier
- **Docker**: Node 22 base images

---

**Note**: This is a working boilerplate. You can use it as-is for testing, but remember to customize it for your project by replacing all placeholder values.
