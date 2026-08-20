import { Phone } from "lucide-react";

export function PhoneCell({
    phone,
}:{
    phone:string
}){

    return(

        <div className="flex items-center gap-2">

            <Phone className="h-4 w-4 text-muted-foreground"/>

            {phone}

        </div>

    )

}