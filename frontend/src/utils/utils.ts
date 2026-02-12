export function getWeekdayAndRelativeTime(date: Date) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Strip time: set to midnight
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Weekday name
  const weekday = weekdays[target.getDay()];

  // Difference in days
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  // Build relative string
  let relativeTime = "";
  if (diffDays === 0) {
    relativeTime = "today";
  } else if (diffDays === 1) {
    relativeTime = "tomorrow";
  } else if (diffDays === -1) {
    relativeTime = "yesterday";
  } else if (diffDays > 1) {
    relativeTime = `in ${diffDays} days`;
  } else if (diffDays < -1) {
    relativeTime = `${Math.abs(diffDays)} days ago`;
  }

  return { weekday, relativeTime };
}
