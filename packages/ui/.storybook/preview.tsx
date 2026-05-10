import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import "../src/styles/globals.css";
import { ThemeProvider } from "../src/providers/theme/provider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Get the theme from the toolbar
      const theme = context.globals.theme || "light";
      
      return (
        <ThemeProvider defaultTheme={theme}>
          <div className="min-h-screen bg-background text-foreground">
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
          { value: "system", title: "System", icon: "browser" },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
};

export default preview;