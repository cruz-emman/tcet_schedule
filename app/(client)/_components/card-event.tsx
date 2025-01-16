import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { MeetingTypeOption } from "@/lib/data";
import { cn } from "@/lib/utils";


type Event = {
  title: string;
  department: string;
  event_date: Date;
  start_time: string;
  end_time: string;
  meeting_type_option: string;
};

type Props = {
  data: any;
};

export const CardEvent = ({ data }: Props) => {


  const getBadgeColor = () => {
    const result = MeetingTypeOption.find((item) => item.value === data?.meeting_type_option);
    return result?.badgeColor ?? '';
  };



  return (
       <Card className="w-10/12">
      <CardHeader>
        <CardTitle>{data?.department}</CardTitle>
        <CardDescription className="capitalize font-bold text-red-500">
          Reserved
        </CardDescription>
        <div>
          <Badge className={getBadgeColor()}>
            {data?.meeting_type_option}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {data?.venue && (
          <div className="flex gap-2">
            <span className="font-medium">Venue:</span>
            <span>{data.venue}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-sm text-gray-600">
          {data?.start_time} to {data?.end_time}
        </div>
      </CardFooter>
    </Card>
  )
};