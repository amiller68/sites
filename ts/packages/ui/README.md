# @repo/ui

A shared UI component library for React projects in this monorepo.

## Features

- 🎨 Themeable components with CSS variables
- 🌓 Dark mode support
- 📚 Storybook documentation
- 🎯 TypeScript support
- 💅 Tailwind CSS styling
- 🔧 Variant-based component design

## Installation

Since this is a workspace package, add it to your package.json:

```json
{
  "dependencies": {
    "@repo/ui": "workspace:*"
  }
}
```

## Setup

### 1. Import the CSS

Add the theme CSS to your app's main CSS file:

```css
@import "@repo/ui/src/styles/theme.css";
```

Or include it in your app's entry point:

```tsx
import "@repo/ui/src/styles/globals.css";
```

### 2. Configure Tailwind

Add the UI package to your Tailwind content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    // ... your app's content paths
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // ... rest of your config
};
```

### 3. Add Theme Provider

Wrap your app with the ThemeProvider:

```tsx
import { ThemeProvider } from "@repo/ui";

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## Components

### Button

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@repo/ui";

<Button variant="default">Click me</Button>
<Button variant="outline" size="lg">Large Outline</Button>
<Button variant="destructive" size="sm">Delete</Button>
```

### Card

A compound component for creating card layouts.

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@repo/ui";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Theming

The library uses CSS variables for theming. You can override any of these variables in your app:

```css
:root {
  --primary: 220 33% 14%;
  --accent: 199 86% 74%;
  /* ... other variables */
}
```

### Using the Theme Hook

```tsx
import { useTheme } from "@repo/ui";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  );
}
```

## Development

### Running Storybook

```bash
cd packages/ui
pnpm storybook
```

### Building

```bash
cd packages/ui
pnpm build
```

## Contributing

When adding new components:

1. Create the component in `src/components/`
2. Export it from `src/index.ts`
3. Create a story in `src/components/[component]/[Component].stories.tsx`
4. Update this README with usage examples