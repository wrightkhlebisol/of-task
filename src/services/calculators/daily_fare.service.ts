import { Fare } from '../../domains/fare/fare';

import { IZoneAnalysisService } from './../../interfaces/IZoneAnalysisService';
import { IFare } from '../../interfaces/IFare';
import { IJourney } from '../../interfaces/IJourney';
import { IFareCalculator } from '../../interfaces/IFareCalculator';
import { IFareRuleRepository } from '../../interfaces/IFareRuleRepository';


export class DailyFareCalculator implements IFareCalculator {
  constructor(
    private readonly singleFareCalculator: IFareCalculator,
    private readonly fareRuleRepository: IFareRuleRepository,
    private readonly zoneAnalysisService: IZoneAnalysisService
  ) { }

  calculateFare(journeys: IJourney[]): IFare {
    if (journeys.length === 0) {
      return new Fare(0);
    }

    // Calculate total uncapped fare for the day
    let totalFare = new Fare(0);
    for (const journey of journeys) {
      const fare = this.singleFareCalculator.calculateFare(journey);
      totalFare = totalFare.add(fare);
    }

    // Apply daily cap based on highest zone pair traveled
    const highestZonePair = this.zoneAnalysisService.getHighestZonePair(journeys);
    const dailyCap = this.fareRuleRepository.getDailyCap(highestZonePair);

    return dailyCap.apply(totalFare);
  }
}
