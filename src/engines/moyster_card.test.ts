import { IFareEngine } from './../interfaces/IFareEngine';
import { FareRuleRepository } from '../repositories/fare_rule.repository';
import { PeakHourService } from '../services/peak_hour.service';
import { Journey } from '../domains/journey/journey';

import { MoysterCardFareEngine } from './moyster_card';

describe('MoysterCardFareEngine', () => {
  let engine: IFareEngine;

  beforeEach(() => {
    engine = new MoysterCardFareEngine();
  });

  test('should calculate fare for single journey', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 2 })
    ];

    const totalFare = engine.calculateFare(journeys);
    expect(totalFare).toBe(35); // Peak fare for 1-2
  });

  test('should calculate fare with daily capping (example from document)', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '10:20', fromZone: 2, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '10:45', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '16:15', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '18:15', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '19:00', fromZone: 1, toZone: 2 }),
    ];

    const totalFare = engine.calculateFare(journeys);
    expect(totalFare).toBe(120); // Daily cap for 1-2
  });

  test('should handle multi-week journeys', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-22', time: '08:00', fromZone: 1, toZone: 1 }),
    ];

    const totalFare = engine.calculateFare(journeys);
    expect(totalFare).toBe(60); // 30 + 30 (two separate weeks)
  });

  test('should return zero for empty journey list', () => {
    const totalFare = engine.calculateFare([]);
    expect(totalFare).toBe(0);
  });

  test('should calculate single journey fare without capping', () => {
    const journey = Journey.fromRawData({
      date: '2024-01-15',
      time: '08:00',
      fromZone: 1,
      toZone: 2
    });

    const fare = engine.calculateSingleJourneyFare(journey);
    expect(fare).toBe(35); // Peak fare for 1-2
  });

  test('should identify peak hours correctly', () => {
    const peakJourney = Journey.fromRawData({
      date: '2024-01-15',
      time: '08:00',
      fromZone: 1,
      toZone: 2
    });

    const offPeakJourney = Journey.fromRawData({
      date: '2024-01-15',
      time: '12:00',
      fromZone: 1,
      toZone: 2
    });

    expect(engine.isJourneyDuringPeakHours(peakJourney)).toBe(true);
    expect(engine.isJourneyDuringPeakHours(offPeakJourney)).toBe(false);
  });

  test('should allow access to fare rule repository', () => {
    const repository = engine.getFareRuleRepository();
    expect(repository).toBeInstanceOf(FareRuleRepository);
  });

  test('should create journey from raw data', () => {
    const rawData = {
      date: '2024-01-15',
      time: '08:30',
      fromZone: 1,
      toZone: 2
    };

    const journey = MoysterCardFareEngine.createJourney(rawData);
    expect(journey).toBeInstanceOf(Journey);
    expect(journey.date.toString()).toBe('2024-01-15');
    expect(journey.time.toString()).toBe('08:30');
    expect(journey.fromZone.id).toBe(1);
    expect(journey.toZone.id).toBe(2);
  });

  test('should handle complex weekly capping scenario', () => {
    // Create a scenario where daily caps are reached but weekly cap kicks in
    const journeys: Journey[] = [];

    // Monday-Thursday: Daily cap reached (1-2 zones = 120 daily cap)
    for (let day = 15; day <= 18; day++) {
      journeys.push(
        Journey.fromRawData({ date: `2024-01-${day}`, time: '08:00', fromZone: 1, toZone: 2 }),
        Journey.fromRawData({ date: `2024-01-${day}`, time: '18:00', fromZone: 2, toZone: 1 }),
        Journey.fromRawData({ date: `2024-01-${day}`, time: '19:00', fromZone: 1, toZone: 2 }),
        Journey.fromRawData({ date: `2024-01-${day}`, time: '20:00', fromZone: 2, toZone: 1 })
      );
    }

    // Friday: Single journey (under daily cap)
    journeys.push(Journey.fromRawData({ date: '2024-01-19', time: '08:00', fromZone: 1, toZone: 1 }));
    journeys.push(Journey.fromRawData({ date: '2024-01-19', time: '09:00', fromZone: 1, toZone: 1 }));

    // Saturday: Single journey
    journeys.push(Journey.fromRawData({ date: '2024-01-20', time: '10:00', fromZone: 1, toZone: 2 }));
    // Saturday: Single journey
    journeys.push(Journey.fromRawData({ date: '2024-01-20', time: '11:00', fromZone: 2, toZone: 1 }));

    const totalFare = engine.calculateFare(journeys);
    expect(totalFare).toBe(600); // Weekly cap for 1-2
  });

  test('should sort journeys by date and time', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-16', time: '10:40', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '18:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '23:00', fromZone: 2, toZone: 2 }),
    ];

    // Should handle out-of-order journeys correctly
    const totalFare = engine.calculateFare(journeys);
    expect(totalFare).toBe(75); // 25 + 30 + 20 (off-peak + peak + off-peak)
  });

  test('should allow custom dependencies', () => {
    const customRepository = new FareRuleRepository();
    const customPeakService = new PeakHourService();

    const customEngine = new MoysterCardFareEngine(customRepository, customPeakService);
    expect(customEngine.getFareRuleRepository()).toBe(customRepository);
  });
});