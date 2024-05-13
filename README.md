# NextJS Templates

[![github actions](https://github.com/blu3eee/nextjs-templates/actions/workflows/cicd.yml/badge.svg)](https://github.com/blu3eee/nextjs-templates/actions/workflows/cicd.yml)
[![prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io)

This repository contains various templates with CI/CD configurations for Next.js projects. The main branch serves as a base template with common configurations, while additional branches are dedicated to specific features or use cases.

## Main Branch

The main branch includes the following features:

- **Next.js** setup with **shadcn/ui** and **Tailwind CSS**
- **Prettier** and **ESLint** configured for code formatting and linting
- **Husky** and **lint-staged** installed and configured for running commitlint on commit messages
- **GitHub Actions** workflow (`cicd.yml`) for Continuous Integration (CI)

The CI workflow ensures that the project is built successfully, linting and formatting rules are followed, and commit messages commitlint to the commitlint convention.

## Use MDX Branch

The `use-mdx` branch includes additional configurations and dependencies for using MDX (Markdown with JSX) in the Next.js project.

## Getting Started

To get started with this repository, clone it to your local machine and navigate to the desired branch:

```bash
git clone https://github.com/blu3eee/nextjs-templates.git
cd nextjs-templates
git checkout main # or any other branch you want to use
```

Then, install the dependencies and run the development server:

```bash
npm install
npm run dev
```

The Next.js application will be available at `http://localhost:3000` by default.

## Contributing

Contributions to this repository are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.
