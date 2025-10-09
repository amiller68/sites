import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider } from "./provider";
import { useTheme } from "../../hooks/use-theme";
import { Button } from "../../components/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/card/card";

function ThemeDemo() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Theme Switcher Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Current theme: <span className="font-semibold">{theme}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("light")}
            >
              Light
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("dark")}
            >
              Dark
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme("system")}
            >
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded bg-background border" />
                <span className="text-sm">Background</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded bg-primary" />
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded bg-secondary" />
                <span className="text-sm">Secondary</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded bg-accent" />
                <span className="text-sm">Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded bg-muted" />
                <span className="text-sm">Muted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded bg-destructive" />
                <span className="text-sm">Destructive</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const meta = {
  title: "Providers/ThemeProvider",
  component: ThemeProvider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeDemo />
    </ThemeProvider>
  ),
};