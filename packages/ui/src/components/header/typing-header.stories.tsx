import type { Meta, StoryObj } from "@storybook/react";
import { TypingHeader } from "./typing-header";

const meta = {
  title: "Components/TypingHeader",
  component: TypingHeader,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The text to display with typewriter effect",
    },
    size: {
      control: "select",
      options: ["text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl"],
      description: "The size of the header text",
    },
    className: {
      control: "text",
      description: "Additional CSS classes to apply",
    },
  },
} satisfies Meta<typeof TypingHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "> hello world",
    size: "text-2xl",
  },
};

export const WelcomeMessage: Story = {
  args: {
    text: "> it's nice to see u",
    size: "text-4xl",
  },
};

export const AboutPage: Story = {
  args: {
    text: "> about",
    size: "text-4xl",
  },
};

export const SmallSize: Story = {
  args: {
    text: "> small header",
    size: "text-xl",
  },
};

export const MediumSize: Story = {
  args: {
    text: "> medium header",
    size: "text-3xl",
  },
};

export const LargeSize: Story = {
  args: {
    text: "> large header",
    size: "text-5xl",
  },
};

export const ExtraLargeSize: Story = {
  args: {
    text: "> huge!",
    size: "text-6xl",
  },
};

export const CustomCommand: Story = {
  args: {
    text: "> npm install",
    size: "text-2xl",
  },
};

export const LongerText: Story = {
  args: {
    text: "> welcome to the terminal interface",
    size: "text-3xl",
  },
};

export const WithCustomClass: Story = {
  args: {
    text: "> styled header",
    size: "text-4xl",
    className: "text-primary",
  },
};

export const MultipleHeaders: Story = {
  render: () => (
    <div className="flex flex-col gap-8 items-center">
      <TypingHeader text="> first command" size="text-2xl" />
      <TypingHeader text="> second command" size="text-3xl" />
      <TypingHeader text="> third command" size="text-4xl" />
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="flex flex-col items-center justify-center h-[80vh] w-[80vw] mx-auto">
      <TypingHeader text="> it's nice to see u" size="text-4xl" />
      <div className="mt-8 text-center">
        <p className="text-lg text-muted-foreground font-roboto-mono">
          a minimal site for development
        </p>
      </div>
    </div>
  ),
};
