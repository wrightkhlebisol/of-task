import { FareRuleRepository } from "./fare_rule.repository";
import { ZonePair } from '../domains/zones/zone_pair';
import { FareRate } from '../domains/fare/fare_rate';
import { FareCap } from '../domains/fare/fare_cap';
import { Fare } from '../domains/fare/fare';
import { Zone } from '../domains/zones/zone';

import { IFareRuleRepository } from '../interfaces/IFareRuleRepository.interface';

describe('FareRuleRepository', () => {
  let repository: IFareRuleRepository;

  beforeEach(() => {
    repository = new FareRuleRepository();
  });

  test('should return default fare rates', () => {
    const zonePair = new ZonePair(new Zone(1), new Zone(2));
    const fareRate = repository.getFareRate(zonePair);

    expect(fareRate.peak.amount).toBe(35);
    expect(fareRate.offPeak.amount).toBe(30);
  });

  test('should return default daily caps', () => {
    const zonePair = new ZonePair(new Zone(1), new Zone(1));
    const dailyCap = repository.getDailyCap(zonePair);

    expect(dailyCap.amount.amount).toBe(100);
  });

  test('should return default weekly caps', () => {
    const zonePair = new ZonePair(new Zone(2), new Zone(2));
    const weeklyCap = repository.getWeeklyCap(zonePair);

    expect(weeklyCap.amount.amount).toBe(400);
  });

  test('should throw error for unknown zone pair', () => {
    const unknownZonePair = new ZonePair(new Zone(1), new Zone(5));

    expect(() => repository.getFareRate(unknownZonePair))
      .toThrow('No fare rate found for zones 1-5');
  });

  test('should allow adding new fare rates', () => {
    const newZonePair = new ZonePair(new Zone(3), new Zone(3));
    const newFareRate = new FareRate(new Fare(40), new Fare(35));

    repository.addFareRate(newZonePair, newFareRate);
    const retrievedRate = repository.getFareRate(newZonePair);

    expect(retrievedRate.peak.amount).toBe(40);
    expect(retrievedRate.offPeak.amount).toBe(35);
  });

  test('should allow adding new daily caps', () => {
    const newZonePair = new ZonePair(new Zone(3), new Zone(3));
    const newCap = new FareCap(new Fare(150));

    repository.addDailyCap(newZonePair, newCap);
    const retrievedCap = repository.getDailyCap(newZonePair);

    expect(retrievedCap.amount.amount).toBe(150);
  });

  test('should allow adding new weekly caps', () => {
    const newZonePair = new ZonePair(new Zone(3), new Zone(3));
    const newCap = new FareCap(new Fare(700));

    repository.addWeeklyCap(newZonePair, newCap);
    const retrievedCap = repository.getWeeklyCap(newZonePair);

    expect(retrievedCap.amount.amount).toBe(700);
  });
});