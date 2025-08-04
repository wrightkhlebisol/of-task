export interface ITimeOfDay {
  getTotalMinutes(): number;
  isBetween(start: ITimeOfDay, end: ITimeOfDay): boolean;
}

export interface ITravelDate {
  getDayOfWeek(): number; // Returns the day of the week (0 for Sunday, 1 for Monday, etc.)
  isWeekDay(): boolean; // Returns true if the date is a weekday (Monday to Friday)
  isWeekend(): boolean; // Returns true if the date is a weekend (Saturday or Sunday)
  daysToMonday(): ITravelDate; // Returns the date of the last Monday
  equals(other: ITravelDate): boolean; // Compares two travel dates for equality
}