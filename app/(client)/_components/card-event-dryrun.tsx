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

export const CardEventDryRun = ({ data }: Props) => {
  console.log(data)
  return (
    <Card className="w-10/12">
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
        <p>{data?.dry_run_start_time} to {data?.dry_run_end_time}</p>
      </CardFooter>
    </Card>
  );
};