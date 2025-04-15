
/**
 * Get an array of dates for the week containing the given date
 * @param date The date to get the week for
 * @returns Array of 7 dates, starting from Sunday
 */
export const getWeekDates = (date: Date): Date[] => {
  const result: Date[] = [];
  const day = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  // Clone the date to avoid modifying the original
  const firstDay = new Date(date);
  
  // Set to the first day of the week (Sunday)
  firstDay.setDate(date.getDate() - day);
  
  // Create dates for the entire week
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(firstDay);
    currentDate.setDate(firstDay.getDate() + i);
    result.push(currentDate);
  }
  
  return result;
};
