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

/**
 * Convert snake_case to "Label Case" (e.g., SUPER_ADMIN -> Super Admin)
 */
export const toLabelCase = (raw: string) =>
  raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Build a role → permissions map, based on server-provided permissions.
 *
 * @param permissionsData - API response object with permissions
 * @returns Record<string, string[]> mapping role labels to permission IDs
 */
export const buildPermissionsMap = (permissionsData: any) => {
  if (!permissionsData?.data) return {};
  const all = permissionsData.data;

  const idFor = (action: string) => all.find((p: any) => p.action === action)?.id;

  return {
    [toLabelCase("WORKER")]: [
      "READ_PROJECT",
      "READ_ORDER",
      "CREATE_ISSUE",
      "EDIT_ISSUE",
      "READ_ISSUE",
      "UPLOAD_PROJECT_FILES",
    ]
      .map(idFor)
      .filter(Boolean),

    [toLabelCase("ADMIN")]: all
      .filter(
        (p: any) => !["MANAGE_USERS", "MANAGE_ROLES", "MANAGE_PERMISSIONS"].includes(p.action)
      )
      .map((p: any) => p.id),

    [toLabelCase("SUPER_ADMIN")]: all.map((p: any) => p.id),
  } as Record<string, string[]>;
};
