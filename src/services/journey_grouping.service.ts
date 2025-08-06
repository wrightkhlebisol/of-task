import { IJourneyGroupingService } from '../interfaces/IJourneyGroupingService';
import { IJourney } from '../interfaces/IJourney';

/**
 * Service for grouping journeys by date or week.
 */
export class JourneyGroupingService implements IJourneyGroupingService {
  /**
   * Groups journeys by their date.
   * @param journeys - List of journeys to group
   * 
   * @return A map where the key is the date string and the value is an array of journeys for that date
   */
  groupByDate(journeys: IJourney[]): Map<string, IJourney[]> {
    const grouped = new Map<string, IJourney[]>();

    for (const journey of journeys) {
      const dateKey = journey.date.toString();
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(journey);
    }

    return grouped;
  }

  /**
   * Groups journeys by their week.
   * @param journeys - List of journeys to group
   * 
   * @return A map where the key is the week start date string and the value is an array of journeys for that week
   */
  groupByWeek(journeys: IJourney[]): Map<string, IJourney[]> {
    const grouped = new Map<string, IJourney[]>();

    for (const journey of journeys) {
      const weekStart = journey.date.getWeekStart().toString();
      if (!grouped.has(weekStart)) {
        grouped.set(weekStart, []);
      }
      grouped.get(weekStart)!.push(journey);
    }

    return grouped;
  }
}