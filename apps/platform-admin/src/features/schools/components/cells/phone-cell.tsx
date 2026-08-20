"use client";

interface Props {
  phone: string | null;
}

export function PhoneCell({ phone }: Props) {
  if (!phone) {
    return "-";
  }

  return (
    <span className="text-sm">
      {phone}
    </span>
  );
}