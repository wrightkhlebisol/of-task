import { Fare } from '../domains/fare/fare';
import { FareCap } from '../domains/fare/fare_cap';
import { FareRate } from '../domains/fare/fare_rate';

import { IFareRuleRepository } from '../interfaces/IFareRuleRepository';
import { IFareRate, IFareCap } from '../interfaces/IFare';
import { IZonePair } from '../interfaces/IZone';

/**
 * Repository for managing fare rules, including fare rates and caps.
 */
export class FareRuleRepository implements IFareRuleRepository {
  private readonly singleFareRates: Map<string, IFareRate>;
  private readonly dailyCaps: Map<string, IFareCap>;
  private readonly weeklyCaps: Map<string, IFareCap>;

  constructor() {
    this.singleFareRates = new Map();
    this.dailyCaps = new Map();
    this.weeklyCaps = new Map();
    this.initializeDefaultRules();
  }

  /**
   * Initializes default fare rules.
   */
  private initializeDefaultRules(): void {
    // Single fare rates
    this.singleFareRates.set('1-1', new FareRate(new Fare(30), new Fare(25)));
    this.singleFareRates.set('1-2', new FareRate(new Fare(35), new Fare(30)));
    this.singleFareRates.set('2-2', new FareRate(new Fare(25), new Fare(20)));

    // Daily caps
    this.dailyCaps.set('1-1', new FareCap(new Fare(100)));
    this.dailyCaps.set('1-2', new FareCap(new Fare(120)));
    this.dailyCaps.set('2-2', new FareCap(new Fare(80)));

    // Weekly caps
    this.weeklyCaps.set('1-1', new FareCap(new Fare(500)));
    this.weeklyCaps.set('1-2', new FareCap(new Fare(600)));
    this.weeklyCaps.set('2-2', new FareCap(new Fare(400)));
  }

  /**
   * Retrieves the fare rate for a given zone pair.
   * @param zonePair The zone pair for which to retrieve the fare rate.
   * @returns The fare rate for the specified zone pair.
   * @throws Error if no fare rate is found for the zone pair.
   */
  getFareRate(zonePair: IZonePair): IFareRate {
    const rate = this.singleFareRates.get(zonePair.getZoneKey());
    if (!rate) {
      throw new Error(`No fare rate found for zones ${zonePair.getZoneKey()}`);
    }
    return rate;
  }

  /**
   * Retrieves the daily cap for a given zone pair.
   * @param zonePair The zone pair for which to retrieve the daily cap.
   * @returns The daily cap for the specified zone pair.
   * @throws Error if no daily cap is found for the zone pair.
   */
  getDailyCap(zonePair: IZonePair): IFareCap {
    const cap = this.dailyCaps.get(zonePair.getZoneKey());
    if (!cap) {
      throw new Error(`No daily cap found for zones ${zonePair.getZoneKey()}`);
    }
    return cap;
  }

  /**
   * Retrieves the weekly cap for a given zone pair.
   * @param zonePair The zone pair for which to retrieve the weekly cap.
   * @returns The weekly cap for the specified zone pair.
   * @throws Error if no weekly cap is found for the zone pair.
   */
  getWeeklyCap(zonePair: IZonePair): IFareCap {
    const cap = this.weeklyCaps.get(zonePair.getZoneKey());
    if (!cap) {
      throw new Error(`No weekly cap found for zones ${zonePair.getZoneKey()}`);
    }
    return cap;
  }

  /**
   * Adds a new fare rate for a zone pair.
   * @param zonePair The zone pair for which to add the fare rate.
   * @param fareRate The fare rate to add.
   */
  addFareRate(zonePair: IZonePair, fareRate: IFareRate): void {
    this.singleFareRates.set(zonePair.getZoneKey(), fareRate);
  }

  /**
   * Adds a new daily cap for a zone pair.
   * @param zonePair The zone pair for which to add the daily cap.
   * @param cap The daily cap to add.
   */
  addDailyCap(zonePair: IZonePair, cap: IFareCap): void {
    this.dailyCaps.set(zonePair.getZoneKey(), cap);
  }

  /**
   * Adds a new weekly cap for a zone pair.
   * @param zonePair The zone pair for which to add the weekly cap.
   * @param cap The weekly cap to add.
   */
  addWeeklyCap(zonePair: IZonePair, cap: IFareCap): void {
    this.weeklyCaps.set(zonePair.getZoneKey(), cap);
  }
}