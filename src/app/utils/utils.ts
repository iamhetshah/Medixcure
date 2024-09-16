export function secondsRemaining(targetDate: Date): number {
  const now = new Date(); // Get the current date and time
  const differenceInMilliseconds = targetDate.getTime() - now.getTime(); // Difference in milliseconds
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000); // Convert milliseconds to seconds
  return differenceInSeconds >= 0 ? differenceInSeconds : -1; // Return seconds remaining, or 0 if the target date is in the past
}

export function convertSeconds(seconds: number) {
  const days = Math.floor(seconds / (24 * 3600)); // Calculate number of days
  const hours = Math.floor((seconds % (24 * 3600)) / 3600); // Calculate remaining hours
  const minutes = Math.floor((seconds % 3600) / 60); // Calculate remaining minutes

  return {
    days: days,
    hours: hours,
    minutes: minutes,
  };
}

export function formatDate(date: Date): string {
  const day = date.getDate();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Determine the suffix (st/nd/rd/th)
  let suffix = 'th';
  if (day === 1 || day === 21 || day === 31) {
    suffix = 'st';
  } else if (day === 2 || day === 22) {
    suffix = 'nd';
  } else if (day === 3 || day === 23) {
    suffix = 'rd';
  }

  return `${day}${suffix}, ${month}, ${year}`;
}
