import { IZone, IZonePair } from '../../interfaces/IZone';

export class ZonePair implements IZonePair {
  private readonly sortedZones: [IZone, IZone];

  /**
   * Creates a id sorted ZonePair instance with two zones.
   * @param zone1 The first zone in the pair.
   * @param zone2 The second zone in the pair.
   */
  constructor(public zone1: IZone, public zone2: IZone) {
    this.sortedZones = [zone1, zone2].sort((a, b) => a.id - b.id) as [IZone, IZone];
  }

  /**
   * Gets a unique key for the zone pair.
   * @returns A string key representing the zone pair, formatted as "zone1Id-zone2Id".
   */
  getZoneKey(): string {
    return `${this.sortedZones[0].id}-${this.sortedZones[1].id}`;
  }

  /**
   * Gets the zones in the pair.
   * @returns An array containing the two zones in sorted order.
   */
  getZones(): IZone[] {
    return this.sortedZones;
  }
}