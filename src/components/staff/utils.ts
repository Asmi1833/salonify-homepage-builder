
/**
 * Get an array of dates for the week containing the given date
 * @param date The date to get the week for
 * @returns Array of 7 dates, starting from Sunday
 */
export const getWeekDates = (date: Date): Date[] => {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const diff = date.getDate() - day; // adjust when day is not Sunday
  
  const weekDates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const newDate = new Date(date);
    newDate.setDate(diff + i);
    weekDates.push(newDate);
  }
  
  return weekDates;
};
