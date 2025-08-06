import { IJourney } from "../interfaces/IJourney";
import { IJourneyGroupingService } from "../interfaces/IJourneyGroupingService";
import { Journey } from "../domains/journey/journey";
import { JourneyGroupingService } from "./journey_grouping.service";

describe('JourneyGroupingService', () => {
  let groupingService: IJourneyGroupingService;
  let journeys: IJourney[];

  beforeEach(() => {
    groupingService = new JourneyGroupingService();
    journeys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 2 }),
      Journey.fromRawData({ date: '2024-01-15', time: '18:00', fromZone: 2, toZone: 1 }),
      Journey.fromRawData({ date: '2024-01-16', time: '08:00', fromZone: 1, toZone: 1 }),
    ];
  });

  test('should group journeys by date', () => {
    const grouped = groupingService.groupByDate(journeys);

    expect(grouped.size).toBe(2);
    expect(grouped.get('2024-01-15')?.length).toBe(2);
    expect(grouped.get('2024-01-16')?.length).toBe(1);
  });

  test('should group journeys by week', () => {
    const weekJourneys = [
      Journey.fromRawData({ date: '2024-01-15', time: '08:00', fromZone: 1, toZone: 2 }), // Monday
      Journey.fromRawData({ date: '2024-01-16', time: '08:00', fromZone: 1, toZone: 2 }), // Tuesday
      Journey.fromRawData({ date: '2024-01-22', time: '08:00', fromZone: 1, toZone: 2 }), // Next Monday
    ];

    const grouped = groupingService.groupByWeek(weekJourneys);

    expect(grouped.size).toBe(2);
    expect(grouped.get('2024-01-15')?.length).toBe(2); // Same week
    expect(grouped.get('2024-01-22')?.length).toBe(1); // Different week
  });

  test('should handle empty journey list', () => {
    const grouped = groupingService.groupByDate([]);
    expect(grouped.size).toBe(0);
  });
});