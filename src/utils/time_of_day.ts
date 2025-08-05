import { ITimeOfDay } from "../interfaces/Utils";

/**
 * TimeOfDay class represents a specific time of day in hours and minutes.
 * It provides methods to create instances from hours and minutes, and to get the total minutes from midnight.
 */
export class TimeOfDay implements ITimeOfDay {
  /**
   * Represents a time of day in hours and minutes.
   * The time is stored as the total number of minutes from midnight.
   */
  private readonly totalMinutes: number;

  /**
   * Creates a TimeOfDay instance from hours and minutes.
   * @param hours The hour part of the time (0-23).
   * @param minutes The minute part of the time (0-59).
   */
  constructor(hours: number, minutes: number) {
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time format");
    }
    this.totalMinutes = hours * 60 + minutes;
  }

  /**
   * Gets the total minutes from midnight for this time of day.
   * @returns The total number of minutes from midnight.
   */
  getTotalMinutes(): number {
    return this.totalMinutes;
  }

  /**
   * Checks if this time of day is between two other times of day.
   * @param start The start time of the range.
   * @param end The end time of the range.
   * @returns True if this time is between start and end, inclusive; otherwise, false.
   */
  isBetween(start: TimeOfDay, end: TimeOfDay): boolean {
    return this.totalMinutes >= start.getTotalMinutes() && this.totalMinutes <= end.getTotalMinutes();
  }

  /**
   * Creates a TimeOfDay instance from a string in HH:MM format.
   * @param timeString The time string to parse.
   * @returns A TimeOfDay instance representing the parsed time.
   * @throws Error if the time string is invalid.
   */
  static fromString(timeString: string): TimeOfDay {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error("Invalid time string format");
    }
    return new TimeOfDay(hours, minutes);
  }

  /**
   * Converts the time of day to a string in HH:MM format.
   * @returns A string representation of the time in HH:MM format.
   */
  toString(): string {
    const hours = Math.floor(this.getTotalMinutes() / 60);
    const minutes = this.getTotalMinutes() % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
}