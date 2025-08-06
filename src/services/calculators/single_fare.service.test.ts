import { SingleFareCalculator } from "./single_fare.service";
import { FareRuleRepository } from "../../repositories/fare_rule.repository";
import { PeakHourService } from "../peak_hour.service";
import { Journey } from "../../domains/journey/journey";

import { IFareCalculator } from "../../interfaces/IFareCalculator";

describe('SingleFareCalculator', () => {
  let calculator: IFareCalculator;

  beforeEach(() => {
    const repository = new FareRuleRepository();
    const peakHourService = new PeakHourService();
    calculator = new SingleFareCalculator(repository, peakHourService);
  });

  test('should calculate peak fare correctly', () => {
    const journey = Journey.fromRawData({
      date: '2024-01-15', // Monday
      time: '08:00', // Peak hour
      fromZone: 1,
      toZone: 2
    });

    const fare = calculator.calculateFare(journey);
    expect(fare.amount).toBe(35); // Peak fare for 1-2
  });

  test('should calculate off-peak fare correctly', () => {
    const journey = Journey.fromRawData({
      date: '2024-01-15', // Monday
      time: '12:00', // Off-peak hour
      fromZone: 1,
      toZone: 2
    });

    const fare = calculator.calculateFare(journey);
    expect(fare.amount).toBe(30); // Off-peak fare for 1-2
  });

  test('should handle same zone journeys', () => {
    const journey = Journey.fromRawData({
      date: '2024-01-15',
      time: '08:00',
      fromZone: 1,
      toZone: 1
    });

    const fare = calculator.calculateFare(journey);
    expect(fare.amount).toBe(30); // Peak fare for 1-1
  });
});
