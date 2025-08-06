import { ITimeOfDay, ITravelDate } from "../interfaces/Utils";
import { TimeOfDay } from "../utils/time_of_day";

import { IPeakHourService } from "../interfaces/IPeakHour";

/**
 * Service to determine if a given time is during peak hours.
 */
export class PeakHourService implements IPeakHourService {
  /**
   * Initializes the service with predefined peak hour periods.
   * Weekday peak hours: 07:00-10:30 and 17:00-20:00
   * Weekend peak hours: 09:00-11:00 and 18:00-22:00
   */
  private readonly weekdayPeakPeriods: ReadonlyArray<[ITimeOfDay, ITimeOfDay]> = [
    [new TimeOfDay(7, 0), new TimeOfDay(10, 30)],   // 07:00-10:30
    [new TimeOfDay(17, 0), new TimeOfDay(20, 0)]    // 17:00-20:00
  ];

  private readonly weekendPeakPeriods: ReadonlyArray<[ITimeOfDay, ITimeOfDay]> = [
    [new TimeOfDay(9, 0), new TimeOfDay(11, 0)],    // 09:00-11:00
    [new TimeOfDay(18, 0), new TimeOfDay(22, 0)]    // 18:00-22:00
  ];

  /**
   * Checks if the given time is during peak hours based on the provided date.
   * @param date - The date of the journey.
   * @param time - The time of the journey.
   * @returns True if the time is during peak hours, false otherwise.
   */
  isPeakHour(date: ITravelDate, time: ITimeOfDay): boolean {
    const periods = date.isWeekDay() ? this.weekdayPeakPeriods : this.weekendPeakPeriods;

    return periods.some(([start, end]) => time.isBetween(start, end));
  }
}