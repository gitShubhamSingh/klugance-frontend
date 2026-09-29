import { School } from "lucide-react";

type Props = {
  name: string;
  email: string;
};

export function SchoolCell({
  name,
  email,
}: Props) {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
        <School className="h-5 w-5 text-primary" />
      </div>

      <div>
        <div className="font-medium">
          {name}
        </div>

        <div className="text-xs text-muted-foreground">
          {email}
        </div>
      </div>

    </div>
  );
}