'use client'

import { Menu, Minus, Plus } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { NavbarLinks } from "@/lib/data"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"



export function SideBar() {
  const [isOpen, setIsOpen] = useState(false)


  return (
    <div className='border-separate hidden md:block w-[80px]'>
      <nav className='container flex items-center justify-between relative '>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button asChild>
              <Button variant={"ghost"} size={"icon"}>
                <Menu />
              </Button>
            </Button>
          </SheetTrigger>
          <SheetContent className='w-[400px] sm:w-[540px]' side="left">
            {/* <Logo /> */}
            <div className='flex flex-col gap-1 pt-4 '>
            <p className="font-semibold text-slate-400">Calendar</p>
              
                <NavbarItem
                 key={NavbarLinks[0].label}
                 link={NavbarLinks[0].link}
                 label={NavbarLinks[0].label}
                 clickCallback={() => setIsOpen((prev) => !prev)}
               />

              <p className="font-semibold text-slate-400">Main</p>
              {NavbarLinks.slice(1, NavbarLinks.length ).map((item) => (
                 <NavbarItem
                 key={item.label}
                 link={item.link}
                 label={item.label}
                 clickCallback={() => setIsOpen((prev) => !prev)}
               />
              ))}
              {/* {NavbarLinks.map((item => (
                <NavbarItem
                  key={item.label}
                  link={item.link}
                  label={item.label}
                  clickCallback={() => setIsOpen((prev) => !prev)}
                />
              )))} */}
              <Button onClick={() => signOut()} className="absolute bottom-2">
                Logout
              </Button>
            </div>

          </SheetContent>
        </Sheet>
        <div className='flex h-[80px] min-h-[60px] items-center gap-x-4'>
          {/* <LogoMobile /> */}
        </div>
        <div className='flex items-center gap-2'>

        </div>


      </nav>
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
