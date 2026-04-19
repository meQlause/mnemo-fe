# MnemoAI Frontend Documentation

Welcome to the MnemoAI Frontend. This application is a high-performance, minimalist React SPA built with Vite and Tailwind CSS v4. It features a custom "Paper & Ink" design system focused on typography and clarity.

---

## Tech Stack

| Tool | Purpose |
| :--- | :--- |
| **React + Vite** | Core framework and build tool. |
| **Tailwind CSS v4** | Modern, variable-driven styling system. |
| **Zustand** | Lightweight, high-performance state management. |
| **React Query** | Server state management and caching. |
| **Tiptap** | Headless rich-text editor for AI-driven notes. |
| **React Router v6** | Client-side routing. |
| **Lucide React** | Consistent, minimalist iconography. |

---

## Design System: "Paper & Ink"

MnemoAI utilizes a custom design language centered around the aesthetic of physical stationery.

### 1. Color Palette
The theme is strictly defined using CSS variables in `src/index.css`.

*   **Paper (`--color-paper`)**: Off-white background (#faf9f7).
*   **Ink (`--color-ink`)**: Deep near-black (#0f0e0d).
*   **Accent (`--color-accent`)**: Warm ceramic orange (#c9773a).
*   **Surface (`--color-surface`)**: Clean white for elevated containers.

### 2. Tailind 4 Canonical Classes
Following the **Tailwind 4** standard, we use canonical classes instead of raw arbitrary values.
*   **Correct**: `bg-paper`, `text-ink`, `border-accent`, `rounded-md`.
*   **Avoid**: `bg-[var(--color-paper)]` or `rounded-[--radius-md]`.

### 3. Design Aesthetics & Gradients
We prioritize a premium, state-of-the-art interface:
*   **Geometric Gradients**: For backgrounds and auth layers, we use repeating linear gradients (e.g., 45-degree dot patterns) to add texture without visual noise.
*   **Micro-animations**: Subtle `fadeIn` and `slideIn` animations are used on all mounting components (`animate-fade-in`).
*   **Minimalist Borders**: Borders use `--color-border-soft` to maintain a delicate, layered look.

---

## Architecture

### 1. Feature-First Structure
The project is organized into `src/features/` where each directory contains the logic, components, and hooks for a specific domain (e.g., `notes`, `auth`).

### 2. State Management Strategy
*   **Zustand**: Used for global UI state (sidebar toggles, active note IDs).
*   **React Query**: Every API call must be wrapped in a React Query hook.
    - use `staleTime: 5 * 60 * 1000` (5 mins) by default.
    - Mutations must invalidate related queries (e.g., adding a note invalidates the `notes` list).

### 3. API Client & Security
The `apiClient.ts` handles all core security concerns:
*   **Auth Initialization Gate**: On page refresh, the app renders a `LoadingScreen` while `authService.refreshTokens()` completes.
*   **CSRF Protection**: Automatically includes the `X-CSRF-Token` header by reading the `fastapi-csrf-token` cookie.
*   **Token Refresh Lock**: Ensures only one `/auth/refresh` request is made even if multiple components trigger a refresh simultaneously.

---

## Development

### Setup
1. `npm install`
2. Create/edit `Vite` environment variables if needed.
3. `npm run dev` to start the development server.

### Standards
*   **Semantic HTML**: Header tags (`<h1>`, `<article>`, `<nav>`) must be used correctly for SEO and Accessibility.
*   **Unique IDs**: All interactive elements (buttons, inputs) must have descriptive, unique IDs for automated testing.
*   **Component Composition**: Prefer small, reusable atomic components over large, monolithic ones.
