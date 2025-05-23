import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

interface HintProps {
    label: String
    children: React.ReactNode
    asChild?: boolean
    side?: 'top' | 'bottom' | 'left' | 'right'
    align?: 'start' | 'center' | 'end'
}

const Hint = ({label,children,asChild,side,align}: HintProps) => {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild={asChild}>
                {children}
            </TooltipTrigger>
            <TooltipContent className='text-black bg-white' side={side} align={align}>
                <p className='font-semibold'>{label}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default Hint