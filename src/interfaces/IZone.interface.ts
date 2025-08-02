export interface IZone {
  id: number;
}

export interface IZonePair {
  getZoneKey(): string;
  getZones(): IZone[];
}
