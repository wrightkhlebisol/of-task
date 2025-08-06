import { Fare } from '../../domains/fare/fare';

import { IFareRuleRepository } from '@interfaces/IFareRuleRepository';
import { IFare } from '@interfaces/IFare';
import { IJourney } from '@interfaces/IJourney';
import { IFareCalculator } from '@interfaces/IFareCalculator';
import { IPeakHourService } from '@interfaces/IPeakHour';

export class SingleFareCalculator implements IFareCalculator {
  constructor(
    private readonly fareRuleRepository: IFareRuleRepository,
    private readonly peakHourService: IPeakHourService
  ) { }

  calculateFare(journey: IJourney): IFare {
    if (!journey?.getZonePair()) {
      return new Fare(0);
    }

    const zonePair = journey.getZonePair();
    const fareRate = this.fareRuleRepository.getFareRate(zonePair);
    const isPeak = this.peakHourService.isPeakHour(journey.date, journey.time);

    return fareRate.getFare(isPeak);
  }
}