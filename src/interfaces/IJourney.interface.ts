import { IZonePair } from './IZone.interface';

interface IJourney {
  getZonePair(): IZonePair;
  fromRawData(rawData: any): IJourney;
}