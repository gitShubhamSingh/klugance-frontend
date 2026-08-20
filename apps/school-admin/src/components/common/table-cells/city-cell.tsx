import { MapPin } from "lucide-react";

export function CityCell({
    city,
}:{
    city:string
}){

    return(

        <div className="flex items-center gap-2">

            <MapPin className="h-4 w-4 text-muted-foreground"/>

            {city}

        </div>

    )

}