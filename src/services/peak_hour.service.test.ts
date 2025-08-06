import { PeakHourService } from '../services/peak_hour.service';
import { TravelDate } from '../utils/travel_date';
import { TimeOfDay } from '../utils/time_of_day';

describe('PeakHourService', () => {
  let peakHourService: PeakHourService;

  beforeEach(() => {
    peakHourService = new PeakHourService();
  });

  test('should identify weekday morning peak hours', () => {
    const monday = new TravelDate('2024-01-15'); // Monday
    const peakTime = new TimeOfDay(8, 0);
    const nonPeakTime = new TimeOfDay(11, 0);

    expect(peakHourService.isPeakHour(monday, peakTime)).toBe(true);
    expect(peakHourService.isPeakHour(monday, nonPeakTime)).toBe(false);
  });

  test('should identify weekday evening peak hours', () => {
    const monday = new TravelDate('2024-01-15');
    const peakTime = new TimeOfDay(18, 0);
    const nonPeakTime = new TimeOfDay(21, 0);

    expect(peakHourService.isPeakHour(monday, peakTime)).toBe(true);
    expect(peakHourService.isPeakHour(monday, nonPeakTime)).toBe(false);
  });

  test('should identify weekend peak hours', () => {
    const saturday = new TravelDate('2024-01-13'); // Saturday
    const peakTime = new TimeOfDay(10, 0);
    const nonPeakTime = new TimeOfDay(12, 0);

    expect(peakHourService.isPeakHour(saturday, peakTime)).toBe(true);
    expect(peakHourService.isPeakHour(saturday, nonPeakTime)).toBe(false);
  });

  test('should handle boundary times correctly', () => {
    const monday = new TravelDate('2024-01-15');
    const startPeak = new TimeOfDay(7, 0);
    const endPeak = new TimeOfDay(10, 30);
    const justAfterPeak = new TimeOfDay(10, 31);

    expect(peakHourService.isPeakHour(monday, startPeak)).toBe(true);
    expect(peakHourService.isPeakHour(monday, endPeak)).toBe(true);
    expect(peakHourService.isPeakHour(monday, justAfterPeak)).toBe(false);
  });
});