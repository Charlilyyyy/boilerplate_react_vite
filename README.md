# Boilerplate React Vite

**Bold Project Title** project description.

---

## Table of Contents
1. [Project Description](#project-description)
2. [Prerequisites](#software-dependencies)
3. [Local Dev Setup](#dev-setup)
4. [Code Structure Overview](#cs-overview)
5. [Things To Change](#ttc)
6. [License](#license)

---

## Project Description

This is a boilerplate for react tsx app with vite

---

## Prerequisites

You may skip this step if you choose to run with container

### NodeJs (version 16.x or above)
- **Installation**: https://nodejs.org/en/download

### Docker / Rancher (optional)
- **Installation Docker**: https://docs.docker.com/engine/install/
- **Installation Rancher**: https://docs.rancherdesktop.io/getting-started/installation/
- **Installation Docker Compose**: https://docs.docker.com/compose/install/

---

## Local Dev Setup

### Without container

1. Navigate to the project directory:
```bash
cd boilerplate_react_vite
```
2. Setup .env:
```bash
cp .env.example .env
```
3. Install dependencies and build the project:
```bash
npm install
npm run build   # For production
```
4. To develop with hot reload:
```bash
npm run dev
```
Access the frontend at http://localhost:5173.

### With container

1. Change scripts in package.json for "dev" to:
```bash
"dev": "vite --host",
```
2. Navigate to the project directory:
```bash
cd boilerplate_react_vite
```
3. Setup .env:
```bash
cp .env.example .env
```
4. Run docker compose
```bash
docker compose up --build --watch
```
Access the frontend at http://localhost:5173.

---

## Code Structure Overview

```bash
root - dist
     - node_modules
     - public
     - src
        - assets
        - components
            - ui : shadcnui
        - contexts
        - hooks
        - interface
        - lib
        - pages
        - App.tsx
        - index.css
        - main.tsx
        - vite-end.d.ts
     - .gitignore
     - components.json
     - eslint.config.js
     - index.html
     - package-lock.json
     - package.json
     - README.md
     - tsconfig.app.json
     - tsconfig.json
     - tsconfig.node.json
     - vite.config.ts
```

---

## Things To Change

This is to change the default settings to apply it according to you project

- **Project Name index.html**: Change to your project name in index.html
- **Navbar**: Change Navbar element according to your proejct in src/App.tsx
- **Layout**: Change Layout according to you project in src/components/Layout.tsx
- **Favicon**: Change favicon.ico according to your project in index.html

---

## License

This is the list of tech stack and library used and its license

```bash
@radix-ui/react-label: MIT
@radix-ui/react-navigation-menu: MIT
@radix-ui/react-slot: MIT
@stripe/react-stripe-js: MIT
@stripe/stripe-js: MIT
@tailwindcss/vite: MIT
class-variance-authority: MIT
clsx: MIT
jwt-decode: MIT
lucide-react: ISC
react: MIT
react-dom: MIT
react-hot-toast: MIT
react-router-dom: MIT
tailwind-merge: MIT
tailwindcss: MIT
Dev dependencies:
@eslint/js: MIT
@types/node: MIT
@types/react: MIT
@types/react-dom: MIT
@vitejs/plugin-react: MIT
eslint: MIT
eslint-plugin-react-hooks: MIT
eslint-plugin-react-refresh: MIT
globals: MIT
tw-animate-css: MIT
typescript: Apache-2.0
typescript-eslint: MIT
vite: MIT
```

---
