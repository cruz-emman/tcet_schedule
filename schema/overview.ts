import { MAX_DATE_RANGE_DAYS } from '@/lib';
import { differenceInBusinessDays, differenceInDays, isToday } from 'date-fns'
import {z} from 'zod'

export const OverviewQuerySchema = z.object({
    from: z.coerce.date(),
    to: z.coerce.date()
}).refine((args) => {
    const {from, to} = args
    const days = differenceInDays(to, from);
    
    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;

    return isValidRange
})


export const CurrentDateQuerySchema = z.object({
    currentDate: z.coerce.date()
})