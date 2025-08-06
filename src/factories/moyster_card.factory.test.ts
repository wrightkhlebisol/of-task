import { MoysterCardFactory } from './moyster_card.factory';

import { MoysterCardFareEngine } from '../engines/moyster_card';
import { FareRuleRepository } from '../repositories/fare_rule.repository';
import { PeakHourService } from '../services/peak_hour.service';
import { Journey } from '../domains/journey/journey';


describe('MoysterCardFactory', () => {
  test('should create standard engine', () => {
    const engine = MoysterCardFactory.createStandardEngine();
    expect(engine).toBeInstanceOf(MoysterCardFareEngine);
  });

  test('should create custom engine with dependencies', () => {
    const customRepository = new FareRuleRepository();
    const customPeakService = new PeakHourService();

    const engine = MoysterCardFactory.createCustomEngine(customRepository, customPeakService);
    expect(engine).toBeInstanceOf(MoysterCardFareEngine);
    expect(engine.getFareRuleRepository()).toBe(customRepository);
  });

  test('should create custom engine with partial dependencies', () => {
    const customRepository = new FareRuleRepository();

    const engine = MoysterCardFactory.createCustomEngine(customRepository);
    expect(engine).toBeInstanceOf(MoysterCardFareEngine);
    expect(engine.getFareRuleRepository()).toBe(customRepository);
  });

  test('should create journeys from raw data', () => {
    const rawJourneys = [
      { date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 2 },
      { date: '2024-01-16', time: '18:00', fromZone: 2, toZone: 1 },
    ];

    const journeys = MoysterCardFactory.createJourneysFromRawData(rawJourneys);

    expect(journeys).toHaveLength(2);
    expect(journeys[0]).toBeInstanceOf(Journey);
    expect(journeys[1]).toBeInstanceOf(Journey);
    expect(journeys[0].date.toString()).toBe('2024-01-15');
    expect(journeys[1].fromZone.id).toBe(2);
  });

  test('should handle empty raw journey array', () => {
    const journeys = MoysterCardFactory.createJourneysFromRawData([]);
    expect(journeys).toHaveLength(0);
  });
});