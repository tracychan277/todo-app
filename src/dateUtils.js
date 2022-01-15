// Reference: https://alexwlchan.net/2020/05/human-friendly-dates-in-javascript/

// Renders a date in the local timezone, including day of the week.
// e.g. "Fri, 22 May 2020"
const dateFormatter = new Intl.DateTimeFormat(
  [], {"year": "numeric", "month": "short", "day": "numeric", "weekday": "short"}
);

// Renders an HH:MM time in the local timezone, including timezone info.
// e.g. "12:17 BST"
const timeFormatter = new Intl.DateTimeFormat(
  [], {"hour": "numeric", "minute": "numeric", "hour12": true}
);

// Given an ISO 8601 date string, render it as a more friendly date
// in the user's timezone.
//
// Examples:
// - "Today at 12:00 pm"
// - "Tomorrow at 11:00 am"
// - "Fri, 22 May 2020 10:00 am"
//
export function getHumanFriendlyDateString(iso8601_date_string) {
  const date = new Date(Date.parse(iso8601_date_string));

  // When are today and yesterday?
  const today = new Date();
  const tomorrow = new Date().setDate(today.getDate() + 1);

  // We have to compare the *formatted* dates rather than the actual dates --
  // for example, if the UTC date and the localised date fall on either side
  // of midnight.
  if (dateFormatter.format(date) == dateFormatter.format(today)) {
    return "Today at " + timeFormatter.format(date);
  } else if (dateFormatter.format(date) == dateFormatter.format(tomorrow)) {
    return "Tomorrow at " + timeFormatter.format(date);
  } else {
    return dateFormatter.format(date) + " " + timeFormatter.format(date);
  }
}
