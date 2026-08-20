"use client";

interface Props {
  website: string | null;
}

export function WebsiteCell({
  website,
}: Props) {
  if (!website) {
    return "-";
  }

  return (
    <a
      href={website}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {website.replace(/^https?:\/\//, "")}
    </a>
  );
}