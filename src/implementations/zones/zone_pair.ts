import { IZone, IZonePair } from '../../interfaces/IZone.interface';

export class ZonePair implements IZonePair {
  private readonly sortedZones: [IZone, IZone];

  constructor(public zone1: IZone, public zone2: IZone) {
    if (zone1.id === zone2.id) {
      throw new Error('Both zones must be different.');
    }
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