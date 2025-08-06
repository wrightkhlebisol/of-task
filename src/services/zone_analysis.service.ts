import { IZonePair } from '@interfaces/IZone';
import { IJourney } from '@interfaces/IJourney';
import { IPeakHourService } from '@interfaces/IPeakHour';
import { IFareRuleRepository } from '@interfaces/IFareRuleRepository';
import { IZoneAnalysisService } from '@interfaces/IZoneAnalysisService';

/**
 * Service to analyze journeys and determine the highest zone pair traveled.
 * This is used for fare calculations, particularly for daily and weekly caps.
 */
export class ZoneAnalysisService implements IZoneAnalysisService {
  constructor(
    private readonly fareRuleRepository: IFareRuleRepository,
    private readonly peakHourService: IPeakHourService
  ) { }
  /**
   * Get the highest zone pair from a list of journeys.
   * The highest zone pair is determined by the highest fare amount.
   * @param journeys - List of journeys to analyze
   * @returns The highest zone pair found in the journeys
   */
  getHighestZonePair(journeys: IJourney[]): IZonePair {
    if (journeys.length === 0) {
      throw new Error('Cannot determine highest zone pair from empty journey list');
    }

    let highestPair = null as unknown as IZonePair;
    let highestFare = 0;

    for (const journey of journeys) {
      const currentPair = journey.getZonePair();
      const currentFareRate = this.fareRuleRepository.getFareRate(currentPair);
      const currentIsPeak = this.peakHourService.isPeakHour(journey.date, journey.time);

      const currentFareAmount = currentFareRate.getFare(currentIsPeak).amount;

      if (currentFareAmount > highestFare) {
        highestFare = currentFareAmount;
        highestPair = currentPair;
      }
    }

    return highestPair;
  }
}