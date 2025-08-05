import { TravelDate } from './travel_date';

describe('TravelDate', () => {
  test('should create date from string', () => {
    const date = new TravelDate('2024-01-15');
    expect(date.toString()).toBe('2024-01-15');
  });

  test('should throw error for invalid date', () => {
    expect(() => new TravelDate('invalid-date')).toThrow('Invalid date string provided.');
  });

  test('should determine day of week correctly', () => {
    const monday = new TravelDate('2024-01-15'); // Monday
    const sunday = new TravelDate('2024-01-14'); // Sunday

    expect(monday.getDayOfWeek()).toBe(1);
    expect(sunday.getDayOfWeek()).toBe(0);
  });

  test('should identify weekdays and weekends', () => {
    const monday = new TravelDate('2024-01-15');
    const saturday = new TravelDate('2024-01-13');

    expect(monday.isWeekDay()).toBe(true);
    expect(monday.isWeekend()).toBe(false);
    expect(saturday.isWeekDay()).toBe(false);
    expect(saturday.isWeekend()).toBe(true);
  });

  test('should get week start (Monday)', () => {
    const wednesday = new TravelDate('2024-01-17');
    const weekStart = wednesday.daysToMonday();

    expect(weekStart.toString()).toBe('2024-01-15'); // Monday
  });

  test('should handle Sunday correctly for week start', () => {
    const sunday = new TravelDate('2024-01-14');
    const weekStart = sunday.daysToMonday();

    expect(weekStart.toString()).toBe('2024-01-08'); // Previous Monday
  });

  test('should compare dates correctly', () => {
    const date1 = new TravelDate('2024-01-15');
    const date2 = new TravelDate('2024-01-15');
    const date3 = new TravelDate('2024-01-16');

    expect(date1.equals(date2)).toBe(true);
    expect(date1.equals(date3)).toBe(false);
  });
});