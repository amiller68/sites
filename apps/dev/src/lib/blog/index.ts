export function formatAuthorString(authors: { name: string }[]): string {
  if (authors.length === 0) return "";
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} and ${authors[1].name}`;

  const lastAuthor = authors[authors.length - 1];
  const otherAuthors = authors.slice(0, -1);
  return `${otherAuthors.map((a) => a.name).join(", ")}, and ${lastAuthor.name}`;
}

export function formatPublishDate(date: string | Date | null): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
}
