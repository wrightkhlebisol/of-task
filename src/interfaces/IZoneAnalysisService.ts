import { IJourney } from './IJourney';
import { IZonePair } from './IZone';

export interface IZoneAnalysisService {
  /**
   * Get the highest zone pair from a list of journeys.
   * The highest zone pair is determined by the maximum zone IDs.
   * @param journeys - List of journeys to analyze
   * @returns The highest zone pair found in the journeys
   */
  getHighestZonePair(journeys: IJourney[]): IZonePair;
}
