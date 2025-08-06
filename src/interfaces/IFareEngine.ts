import { IFareRuleRepository } from '@interfaces/IFareRuleRepository';
import { IJourney } from '@interfaces/IJourney';

export interface IFareEngine {
  calculateFare(journeys: IJourney[]): number;
  isJourneyDuringPeakHours(journey: IJourney): boolean;
  calculateSingleJourneyFare(journey: IJourney): number;
  getFareRuleRepository(): IFareRuleRepository;
}