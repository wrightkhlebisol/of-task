import { IJourney } from '@interfaces/IJourney';
import { IFareCalculator } from '@interfaces/IFareCalculator';
import { IFareRuleRepository } from '@interfaces/IFareRuleRepository';
import { IZoneAnalysisService } from '@interfaces/IZoneAnalysisService';
import { IJourneyGroupingService } from '@interfaces/IJourneyGroupingService';

import { Fare } from '../../domains/fare/fare';

export class WeeklyFareCalculator implements IFareCalculator {
  constructor(
    private readonly dailyFareCalculator: IFareCalculator,
    private readonly fareRuleRepository: IFareRuleRepository,
    private readonly zoneAnalysisService: IZoneAnalysisService,
    private readonly journeyGroupingService: IJourneyGroupingService
  ) { }

  calculateFare(journeys: IJourney[]): Fare {
    if (journeys.length === 0) {
      return new Fare(0);
    }

    // Group journeys by date and calculate daily fares
    const dailyGroups = this.journeyGroupingService.groupByDate(journeys);
    let totalWeeklyFare = new Fare(0);

    for (const dayJourneys of dailyGroups.values()) {
      const dailyFare = this.dailyFareCalculator.calculateFare(dayJourneys);
      totalWeeklyFare = totalWeeklyFare.add(dailyFare);
    }

    // Apply weekly cap based on highest zone pair traveled in the week
    const highestZonePair = this.zoneAnalysisService.getHighestZonePair(journeys);
    const weeklyCap = this.fareRuleRepository.getWeeklyCap(highestZonePair);

    return weeklyCap.apply(totalWeeklyFare);
  }
}