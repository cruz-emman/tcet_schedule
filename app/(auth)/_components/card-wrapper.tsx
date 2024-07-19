"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { BackButton } from "./back-button";
import { Header } from "./header";


interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  // showSocial?: boolean;
}

const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref


}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
    
      <CardFooter>
        <BackButton 
            //@ts-ignore
            label={backButtonLabel}
             //@ts-ignore
            href={backButtonHref}
        />
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;