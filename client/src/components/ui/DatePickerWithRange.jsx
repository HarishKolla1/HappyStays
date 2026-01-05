import * as React from 'react';
import { addDays, format, isSameDay, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function DatePickerWithRange({ className, setDateRange, disabledDates = [] }) {
  const [date, setDate] = React.useState(null);

  // Helper to strip time and compare only dates
  const isSameDate = (date1, date2) => {
    return isSameDay(new Date(date1), new Date(date2));
  };

  // Check if a specific single day is disabled
  const isDateDisabled = (day) => {
    const checkDate = new Date(day);
    checkDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Disable past dates (allow today for check-in)
    if (checkDate < today) return true;

    // 2. Check if date falls within any booked range
    return disabledDates.some((booking) => {
      const checkIn = new Date(booking.checkIn);
      checkIn.setHours(0, 0, 0, 0);
      
      const checkOut = new Date(booking.checkOut);
      checkOut.setHours(0, 0, 0, 0);

      // Logic: The date is disabled if it is >= checkIn AND < checkOut.
      // We use < checkOut because the Checkout day itself is usually available for new check-in.
      return checkDate >= checkIn && checkDate < checkOut;
    });
  };

  // Watch for changes in selection to prevent "jumping" over bookings
  React.useEffect(() => {
    if (date?.from && date?.to) {
      // Create a list of all days in the selected interval
      const range = eachDayOfInterval({ start: date.from, end: date.to });
      
      // Check if ANY day in this range is disabled
      const isRangeInvalid = range.some(day => isDateDisabled(day));

      if (isRangeInvalid) {
        // If they tried to select over a booking, reset to just the start date
        setDate({ from: date.from, to: null });
        setDateRange({ from: date.from, to: null });
      } else {
        // Valid range
        setDateRange(date);
      }
    } else {
      // Just start date or empty
      setDateRange(date);
    }
  }, [date]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild className="border-none text-black hover:bg-transparent">
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span className="text-base font-semibold">Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled={isDateDisabled} // This grays out the dates visually
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}