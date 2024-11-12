import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MeetingTypeOption } from "@/lib/data";


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

export const CardEventDryRun = ({ data }: Props) => {

  
  const ShowBadge = () => {
    const result = MeetingTypeOption.filter((item) => item.value === data?.meeting_type_option)
    return result[0].badgeColor
  }



  return (
    <Card className="w-10/12">
      <CardHeader>
      <CardTitle>{data?.department}</CardTitle>
      <CardDescription className="capitalize font-bold text-red-500">Reserved</CardDescription>
      <CardDescription>
          <Badge className={ShowBadge()}>
          {data?.meeting_type_option}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data?.venue && (
          <p>Venue <span>{data?.venue}
          </span></p>
        )}

      </CardContent>
      <CardFooter>
        <p>{data?.dry_run_start_time} to {data?.dry_run_end_time}</p>
      </CardFooter>
    </Card>
  );
};