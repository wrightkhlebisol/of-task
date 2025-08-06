import { IJourney } from '@interfaces/IJourney';

export interface IJourneyGroupingService {
  /**
   * Groups journeys by their date.
   * @param journeys - List of journeys to group
   * 
   * @return A map where the key is the date string and the value is an array of journeys for that date
   */
  groupByDate(journeys: IJourney[]): Map<string, IJourney[]>;
  groupByWeek(journeys: IJourney[]): Map<string, IJourney[]>;
}

