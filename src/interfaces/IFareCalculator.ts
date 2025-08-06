import { IJourney } from './IJourney';
import { IFare } from './IFare';

export interface IFareCalculator {
  calculateFare(journey: IJourney | IJourney[]): IFare;
}