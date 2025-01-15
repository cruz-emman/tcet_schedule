import { ScrollArea } from "@/components/ui/scroll-area";
import CardColumn from "./CardColumn";
import { GetOverDataReponseType } from "@/app/api/data-history/route";

// Column.tsx
type ColumnProps = {
  data: GetOverDataReponseType;
  title: string;
  color: string;
};



export const Column = ({ title, data, color }: ColumnProps) => { 
return (
  <div className="flex mt-2 w-96 flex-col rounded-lg bg-secondary p-4">
    <div className='flex items-center justify-start mb-4 gap-x-2 '>
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <h2 className="font-semibold text-neutral-800">{title}</h2>
    </div>
    <div className="flex flex-1 flex-col gap-4">
      <ScrollArea className='h-[800px] pr-4'>
          {data.map((d) => (
            <div key={d.id}>
                <CardColumn 
                  data={d}
                  title={title}
                />
            </div>
          ))}
      </ScrollArea>
    </div>
  </div>
);
};
