import { format } from "date-fns";

// Helper function to format embedded dates in "newValue"
export const formatEmbeddedDates = (value: string) => {
  const dateRegex =
    /\b[A-Za-z]{3,} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT\+\d{4} \([^)]+\)/g; // Match date strings
  return value.replace(dateRegex, (date) => {
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? date : format(parsedDate, "PPP");
  });
};

// Helper function to parse newValue for "Issue Created"
export const parseNewValueToList = (value: string) => {
  const entries = value.split("\n").map((line) => line.trim());
  return entries.map((entry) => {
    const [key, ...rest] = entry.split(":");
    const formattedValue = formatEmbeddedDates(rest.join(":").trim());
    return { key: key?.trim() || "Unknown", value: formattedValue || "N/A" };
  });
};

