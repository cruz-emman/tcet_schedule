'use client'

import { ArrowRightFromLine, BarChart, CalendarDays, LayoutDashboard, Menu, Minus, Plus, Table,LogOut } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { logout } from "./_actions/logout"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Hint from "./hint"
import { Separator } from "./ui/separator"



export function SideBar() {
  const [isOpen, setIsOpen] = useState(false)
  const onClick = () => {
    logout()
}

  return (
    <div className="h-full w-[80px] hidden md:flex shadow-xl overflow-y-auto flex-shrink-0">
      <div className=" relative h-full w-full flex flex-col items-center gap-y-2 py-4">

        <Hint
          label="Appointment"
          asChild
          side="right"
        >
          <Link href="/">
          <Button
            variant="ghost"
          >
            <CalendarDays className='h-8 w-8' />
          </Button>
          </Link>
        </Hint>

        <Separator
          orientation="horizontal"
          className="my-2 w-full"
        />
        <Hint
          label="Dashboard"
          asChild
          side="right"
        >
       <Link href="/dashboard">
       <Button
            variant="ghost"
          >
            <LayoutDashboard className='h-8 w-8' />
          </Button>
       </Link>
        </Hint>
        <Hint
          label="Result "
          asChild
          side="right"
        >
         <Link href="/results">
         <Button
            variant="ghost"
          >
            <Table className='h-8 w-8' />
          </Button>
         </Link>
        </Hint>
        <Hint
          label="Overview "
          asChild
          side="right"
        >
          <Link href="/reports">
            <Button
              variant="ghost"
            >
              <BarChart className='h-8 w-8 ' />
            </Button>
          </Link>
        </Hint>
      
      <div className="absolute bottom-2">
      <Hint
          label="Logout "
          asChild
          side="right"
        >
            <Button
              variant="ghost"
              onClick={onClick}
            >
              <LogOut className='h-8 w-8 ' />
            </Button>
        </Hint>
      </div>
      </div>
    </div>
  )
}




function NavbarItem({
  link,
  label,
  clickCallback,
}: {
  link: string;
  label: string;
  clickCallback?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full justify-start text-sm font-semibold text-muted-foreground hover:text-foreground z",
          isActive && "text-foreground"
        )}
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {label}
      </Link>
      {isActive && (
        <div className="absolute font-bold text-black -bottom-[2px] left-1/2 hidden h-[2px] w-full -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}
