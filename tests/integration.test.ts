import { MoysterCardFareEngine } from '../src/engines/moyster_card';
import { MoysterCardFactory } from '../src/factories/moyster_card.factory';
import { Journey } from '../src/domains/journey/journey';
import { FareRuleRepository } from '../src/repositories/fare_rule.repository';
import { FareRate } from '../src/domains/fare/fare_rate';
import { FareCap } from '../src/domains/fare/fare_cap';
import { Fare } from '../src/domains/fare/fare';
import { Zone } from '../src/domains/zones/zone';
import { ZonePair } from '../src/domains/zones/zone_pair';
import { PeakHourService } from '../src/services/peak_hour.service';

describe('Integration Tests', () => {
  let engine: MoysterCardFareEngine;

  beforeEach(() => {
    engine = MoysterCardFactory.createStandardEngine();
  });

  test('should handle real-world scenario: commuter week', () => {
    const rawJourneys = [
      // Monday: Peak commute
      { date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 2 }, // 35 (peak)
      { date: '2024-01-15', time: '18:00', fromZone: 2, toZone: 1 }, // 35 (peak)

      // Tuesday: Off-peak travel
      { date: '2024-01-16', time: '10:40', fromZone: 1, toZone: 2 }, // 30 (off-peak)
      { date: '2024-01-16', time: '15:00', fromZone: 2, toZone: 1 }, // 30 (off-peak)

      // Wednesday: Mixed
      { date: '2024-01-17', time: '07:30', fromZone: 1, toZone: 1 }, // 30 (peak)
      { date: '2024-01-17', time: '19:30', fromZone: 1, toZone: 2 }, // 35 (peak)

      // Thursday: Heavy travel day (should hit daily cap)
      { date: '2024-01-18', time: '08:00', fromZone: 1, toZone: 2 }, // Start of cap calculation
      { date: '2024-01-18', time: '12:00', fromZone: 2, toZone: 1 },
      { date: '2024-01-18', time: '14:00', fromZone: 1, toZone: 2 },
      { date: '2024-01-18', time: '18:00', fromZone: 2, toZone: 1 },
      { date: '2024-01-18', time: '20:00', fromZone: 1, toZone: 2 }, // Should be capped at 120

      // Friday: Single journey
      { date: '2024-01-19', time: '08:00', fromZone: 1, toZone: 1 }, // 30
    ];

    const journeys = MoysterCardFactory.createJourneysFromRawData(rawJourneys);
    const totalFare = engine.calculateFare(journeys);

    // Monday: 70, Tuesday: 60, Wednesday: 65, Thursday: 120 (capped), Friday: 30
    // Total: 345, but should be capped at weekly cap of 600 for 1-2 zones
    expect(totalFare).toBe(345);
  });

  test('should handle edge case: journey at midnight', () => {
    const journey = Journey.fromRawData({
      date: '2024-01-15',
      time: '00:00',
      fromZone: 1,
      toZone: 2
    });

    const fare = engine.calculateSingleJourneyFare(journey);
    expect(fare).toBe(30); // Should be off-peak
  });

  test('should handle same-zone journeys consistently', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 2, toZone: 2 }),
      Journey.fromRawData({ date: '2024-01-15', time: '12:00', fromZone: 2, toZone: 2 }),
    ];

    const totalFare = engine.calculateFare(journeys);
    expect(totalFare).toBe(45); // 25 (peak) + 20 (off-peak) for 2-2
  });

  test('should handle cross-week journeys correctly', () => {
    const journeys = [
      // End of week 1 (Sunday)
      Journey.fromRawData({ date: '2024-01-14', time: '14:00', fromZone: 1, toZone: 2 }), // 30 (weekend off-peak)
      // Start of week 2 (Monday)
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 2 }), // 35 (weekday peak)
    ];

    const totalFare = engine.calculateFare(journeys);
    expect(totalFare).toBe(65); // 30 (weekend off-peak) + 35 (weekday peak)
  });

  test('should validate fare calculation components independently', () => {
    const journey = Journey.fromRawData({
      date: '2024-01-15',
      time: '08:00',
      fromZone: 1,
      toZone: 2
    });

    // Test individual components
    expect(engine.isJourneyDuringPeakHours(journey)).toBe(true);
    expect(engine.calculateSingleJourneyFare(journey)).toBe(35);

    // Test as part of larger calculation
    expect(engine.calculateFare([journey])).toBe(35);
  });

  test('should handle extensibility: adding new zones', () => {
    const repository = engine.getFareRuleRepository();

    // Add zone 3 fare rules
    const zone3Pair = new ZonePair(new Zone(3), new Zone(3));
    repository.addFareRate(zone3Pair, new FareRate(new Fare(40), new Fare(35)));
    repository.addDailyCap(zone3Pair, new FareCap(new Fare(150)));
    repository.addWeeklyCap(zone3Pair, new FareCap(new Fare(700)));

    // Test with new zone
    const journey = Journey.fromRawData({
      date: '2024-01-15',
      time: '08:00',
      fromZone: 3,
      toZone: 3
    });

    expect(engine.calculateSingleJourneyFare(journey)).toBe(40);
  });
});

// Error handling tests
describe('Error Handling', () => {
  let engine: MoysterCardFareEngine;

  beforeEach(() => {
    engine = new MoysterCardFareEngine();
  });

  test('should handle invalid journey data gracefully', () => {
    expect(() => {
      Journey.fromRawData({
        date: 'invalid-date',
        time: '08:00',
        fromZone: 1,
        toZone: 2
      });
    }).toThrow('Invalid date string provided.');

    expect(() => {
      Journey.fromRawData({
        date: '2024-01-15',
        time: '25:00',
        fromZone: 1,
        toZone: 2
      });
    }).toThrow('Invalid time string format');

    expect(() => {
      Journey.fromRawData({
        date: '2024-01-15',
        time: '08:00',
        fromZone: 0,
        toZone: 2
      });
    }).toThrow('Zone ID must be a positive integer');
  });

  test('should handle unknown zone combinations', () => {
    const journey = Journey.fromRawData({
      date: '2024-01-15',
      time: '08:00',
      fromZone: 1,
      toZone: 5 // Unknown zone
    });

    expect(() => {
      engine.calculateSingleJourneyFare(journey);
    }).toThrow('No fare rate found for zones 1-5');
  });

  test('should handle negative fare amounts', () => {
    expect(() => new Fare(-10)).toThrow('Fare amount cannot be negative');
  });
});


// Mock tests for dependency injection
describe('Dependency Injection Tests', () => {
  test('should work with mocked dependencies', () => {
    // Create mock repository
    const mockRepository = {
      getFareRate: jest.fn().mockReturnValue(new FareRate(new Fare(50), new Fare(40))),
      getDailyCap: jest.fn().mockReturnValue(new FareCap(new Fare(200))),
      getWeeklyCap: jest.fn().mockReturnValue(new FareCap(new Fare(1000))),
      addFareRate: jest.fn(),
      addDailyCap: jest.fn(),
      addWeeklyCap: jest.fn(),
    } as unknown as FareRuleRepository;

    // Create mock peak service
    const mockPeakService = {
      isPeakHour: jest.fn().mockReturnValue(true),
    } as unknown as PeakHourService;

    const engine = new MoysterCardFareEngine(mockRepository, mockPeakService);

    const journey = Journey.fromRawData({
      date: '2024-01-15',
      time: '08:00',
      fromZone: 1,
      toZone: 2
    });

    const fare = engine.calculateSingleJourneyFare(journey);

    expect(fare).toBe(50); // Mock peak fare
    expect(mockRepository.getFareRate).toHaveBeenCalled();
    expect(mockPeakService.isPeakHour).toHaveBeenCalled();
  });
});