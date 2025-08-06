import { ZoneAnalysisService } from './zone_analysis.service';
import { Journey } from '../domains/journey/journey';
import { FareRuleRepository } from '../repositories/fare_rule.repository';

import { IZoneAnalysisService } from '../interfaces/IZoneAnalysisService';
import { PeakHourService } from './peak_hour.service';


describe('ZoneAnalysisService', () => {
  let zoneAnalysisService: IZoneAnalysisService;

  beforeEach(() => {
    const fareRuleRepository = new FareRuleRepository();
    const peakHourService = new PeakHourService();
    zoneAnalysisService = new ZoneAnalysisService(fareRuleRepository, peakHourService);
  });

  test('should find highest zone pair', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 1 }), // Daily cap: 100
      Journey.fromRawData({ date: '2024-01-15', time: '09:00', fromZone: 1, toZone: 2 }), // Daily cap: 120 (highest)
      Journey.fromRawData({ date: '2024-01-15', time: '10:00', fromZone: 2, toZone: 2 }), // Daily cap: 80
    ];

    const highestPair = zoneAnalysisService.getHighestZonePair(journeys);
    expect(highestPair.getZoneKey()).toBe('1-2');
  });

  test('should handle same zone combinations', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-15', time: '09:00', fromZone: 1, toZone: 1 }),
    ];

    const highestPair = zoneAnalysisService.getHighestZonePair(journeys);
    expect(highestPair.getZoneKey()).toBe('1-1');
  });


  test('should prioritize cross-zone travel over same-zone', () => {
    const journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 1 }), // Daily cap: 100
      Journey.fromRawData({ date: '2024-01-15', time: '09:00', fromZone: 2, toZone: 2 }), // Daily cap: 80
    ];

    const highestPair = zoneAnalysisService.getHighestZonePair(journeys);
    expect(highestPair.getZoneKey()).toBe('1-1'); // Should be 1-1 because it has higher daily cap than 2-2
  });

  test('should throw error for empty journey list', () => {
    expect(() => zoneAnalysisService.getHighestZonePair([]))
      .toThrow('Cannot determine highest zone pair from empty journey list');
  });

});