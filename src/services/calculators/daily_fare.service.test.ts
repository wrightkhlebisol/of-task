import { DailyFareCalculator } from './daily_fare.service';
import { SingleFareCalculator } from './single_fare.service';
import { FareRuleRepository } from '../../repositories/fare_rule.repository';
import { ZoneAnalysisService } from '../zone_analysis.service';
import { Journey } from '../../domains/journey/journey';
import { PeakHourService } from '../peak_hour.service';

import { IFareCalculator } from '../../interfaces/IFareCalculator';

describe('DailyFareCalculator', () => {
  let calculator: IFareCalculator;

  beforeEach(() => {
    const fareRuleRepository = new FareRuleRepository();
    const peakService = new PeakHourService();
    const singleFareCalculator = new SingleFareCalculator(fareRuleRepository, peakService);
    const zoneAnalysisService = new ZoneAnalysisService(fareRuleRepository, peakService);
    calculator = new DailyFareCalculator(singleFareCalculator, fareRuleRepository, zoneAnalysisService);
  });

  test('should calculate daily fare without capping', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '12:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '13:00', fromZone: 1, toZone: 1 }),
    ];

    const fare = calculator.calculateFare(journeys);
    expect(fare.amount).toBe(50); // 25 + 25 (off-peak 1-1)
  });

  test('should apply daily cap when exceeded', () => {
    const journeys = [
      // Multiple journeys that would exceed daily cap of 100 for 1-1
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '09:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '10:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '18:00', fromZone: 1, toZone: 1 }),
    ];

    const fare = calculator.calculateFare(journeys);
    expect(fare.amount).toBe(100); // Daily cap for 1-1
  });

  test('should use highest zone pair for cap determination', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '09:00', fromZone: 1, toZone: 2 }),
    ];

    const fare = calculator.calculateFare(journeys);
    // Should use 1-2 cap (120) not 1-1 cap (100)
    expect(fare.amount).toBe(65); // 30 + 35, under the 120 cap
  });

  test('should return zero for empty journey list', () => {
    const fare = calculator.calculateFare([]);
    expect(fare.amount).toBe(0);
  });
});