import { TimeOfDay } from './time_of_day';

describe('TimeOfDay', () => {
  test('should create time from hours and minutes', () => {
    const time = new TimeOfDay(8, 30);
    expect(time.getTotalMinutes()).toBe(510); // 8 * 60 + 30
  });

  test('should create time from string', () => {
    const time = TimeOfDay.fromString('08:30');
    expect(time.getTotalMinutes()).toBe(510);
  });

  test('should throw error for invalid time', () => {
    expect(() => new TimeOfDay(25, 0)).toThrow('Invalid time format');
    expect(() => new TimeOfDay(8, 60)).toThrow('Invalid time format');
    expect(() => new TimeOfDay(-1, 30)).toThrow('Invalid time format');
  });

  test('should check if time is between two times', () => {
    const time = new TimeOfDay(9, 0);
    const start = new TimeOfDay(8, 0);
    const end = new TimeOfDay(10, 0);

    expect(time.isBetween(start, end)).toBe(true);

    const earlyTime = new TimeOfDay(7, 0);
    expect(earlyTime.isBetween(start, end)).toBe(false);
  });

  test('should convert to string with padding', () => {
    const time = new TimeOfDay(8, 5);
    expect(time.toString()).toBe('08:05');
  });
});