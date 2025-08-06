import { Journey } from '../../domains/journey/journey';
import { FareRuleRepository } from '../../repositories/fare_rule.repository';
import { ZoneAnalysisService } from '../zone_analysis.service';
import { SingleFareCalculator } from './single_fare.service';
import { DailyFareCalculator } from './daily_fare.service';
import { WeeklyFareCalculator } from './weekly_fare.service';
import { PeakHourService } from '../peak_hour.service';
import { JourneyGroupingService } from '../journey_grouping.service';

import { IFareCalculator } from '../../interfaces/IFareCalculator';

describe('WeeklyFareCalculator', () => {
  let calculator: IFareCalculator;

  beforeEach(() => {
    const fareRuleRepository = new FareRuleRepository();
    const peakService = new PeakHourService();
    const singleFareCalculator = new SingleFareCalculator(fareRuleRepository, peakService);
    const zoneAnalysisService = new ZoneAnalysisService(fareRuleRepository, peakService);
    const dailyFareCalculator = new DailyFareCalculator(singleFareCalculator, fareRuleRepository, zoneAnalysisService);
    const journeyGroupingService = new JourneyGroupingService();

    calculator = new WeeklyFareCalculator(
      dailyFareCalculator,
      fareRuleRepository,
      zoneAnalysisService,
      journeyGroupingService
    );
  });

  test('should calculate weekly fare without capping', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '12:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-16', time: '12:00', fromZone: 1, toZone: 1 }),
    ];

    const fare = calculator.calculateFare(journeys);
    expect(fare.amount).toBe(50); // 25 + 25
  });

  test('should apply weekly cap when exceeded', () => {
    // Create journeys that would exceed weekly cap
    const journeys: Journey[] = [];
    for (let day = 15; day <= 19; day++) { // Monday to Friday
      for (let hour = 8; hour <= 20; hour += 2) {
        journeys.push(Journey.fromRawData({
          date: `2024-01-${day}`,
          time: `${hour}:00`,
          fromZone: 1,
          toZone: 2
        }));
      }
    }

    const fare = calculator.calculateFare(journeys);
    expect(fare.amount).toBe(600); // Weekly cap for 1-2
  });

  test('should return zero for empty journey list', () => {
    const fare = calculator.calculateFare([]);
    expect(fare.amount).toBe(0);
  });
});