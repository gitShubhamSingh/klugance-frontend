import { Badge } from "@/components/ui/badge";

type Props = {
    status: string;
};

export function StatusBadge({
    status,
}: Props) {

    switch (status) {

        case "ACTIVE":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    Active
                </Badge>
            );

        case "INACTIVE":
            return (
                <Badge 
                    variant="secondary" 
                    className="
                    bg-slate-100
                    text-slate-700
                    hover:bg-slate-100
                ">
                    Inactive
                </Badge>
            );

        case "SUSPENDED":
            return (
                <Badge variant="destructive" className="
                bg-red-100
                text-red-700
                hover:bg-red-100
                ">
                    Suspended
                </Badge>
            );

        default:
            return (
                <Badge variant="outline">
                    {status}
                </Badge>
            );
    }
}