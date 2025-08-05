import { ITravelDate } from '../../interfaces/Utils.interface';

export class TravelDate implements ITravelDate {
  private readonly date: Date;

  /**
   * Creates a TravelDate instance from a date string in YYYY-MM-DD format.
   * @param dateString The date string to create the TravelDate from.
   */
  constructor(dateString: string) {
    this.date = new Date(dateString);
    if (isNaN(this.date.getTime())) {
      throw new Error('Invalid date string provided.');
    }
  }

  /**
   * Gets day of the week.
   * @returns The day of the week (0 for Sunday, 1 for Monday, etc.).
   */
  getDayOfWeek(): number {
    return this.date.getDay();
  }

  /**
   * Checks if the travel date is a weekday (Monday to Friday).
   * @returns True if the date is a weekday, otherwise false.
   */
  isWeekDay(): boolean {
    const day = this.getDayOfWeek();
    return day >= 1 && day <= 5; // Monday to Friday
  }

  /**
   * Checks if the travel date is a weekend (Saturday or Sunday).
   * @returns True if the date is a weekend, otherwise false.
   */
  isWeekend(): boolean {
    return !this.isWeekDay();
  }

  /**
   * Returns the date of the last Monday.
   * @returns TravelDate instance representing the last Monday.
   */
  getWeekStart(): ITravelDate {
    const d = new Date(this.date);
    const dayOfWeek = d.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if Sunday, make Monday the start of the week
    d.setDate(d.getDate() + diff);
    return new TravelDate(d.toISOString().split('T')[0]); // Returns the last Monday
  }

  toString(): string {
    return this.date.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
  }

  equals(other: ITravelDate): boolean {
    return this.toString() === other.toString();
  }
}