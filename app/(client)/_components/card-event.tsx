import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.title}</CardTitle>
        <CardDescription className="capitalize">{data?.meeting_type_option}</CardDescription>
      </CardHeader>
      <CardContent>
        {data?.venue && (
          <p>Venue <span>{data?.venue}
          </span></p>
        )}

      </CardContent>
      <CardFooter>
        <p>{data?.start_time} to {data?.end_time}</p>
      </CardFooter>
    </Card>
  );
};