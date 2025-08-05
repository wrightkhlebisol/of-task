import { Journey, RawData } from "./journey";
import { Zone } from "../zones/zone";
import { TravelDate } from "../../utils/travel_date";
import { TimeOfDay } from "../../utils/time_of_day";

describe('Journey', () => {
  const testDate = new TravelDate('2024-01-15');
  const testTime = new TimeOfDay(8, 30);
  const zone1 = new Zone(1);
  const zone2 = new Zone(2);

  test('should create journey with all properties', () => {
    const journey = new Journey(testDate, testTime, zone1, zone2);

    expect(journey.date).toBe(testDate);
    expect(journey.time).toBe(testTime);
    expect(journey.fromZone).toBe(zone1);
    expect(journey.toZone).toBe(zone2);
  });

  test('should get zone pair correctly', () => {
    const journey = new Journey(testDate, testTime, zone2, zone1);
    const zonePair = journey.getZonePair();

    expect(zonePair.getZoneKey()).toBe('1-2');
  });

  test('should create from raw data', () => {
    const rawData = {
      date: '2024-01-15',
      time: '08:30',
      fromZone: 1,
      toZone: 2
    } as unknown as RawData;

    const journey = Journey.fromRawData(rawData);

    expect(journey.date.toString()).toBe('2024-01-15');
    expect(journey.time.toString()).toBe('08:30');
    expect(journey.fromZone.id).toBe(1);
    expect(journey.toZone.id).toBe(2);
  });

  test('should convert to string correctly', () => {
    const journey = new Journey(testDate, testTime, zone1, zone2);
    expect(journey.toString()).toBe('2024-01-15 08:30: 1->2');
  });
});