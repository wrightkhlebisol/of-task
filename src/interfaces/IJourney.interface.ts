import { ITravelDate, ITimeOfDay } from '../interfaces/Utils.interface';
import { IZonePair, IZone } from './IZone.interface';

/**
 * Interface representing a journey in the transportation system.
 */
export interface IJourney {
  fromZone: IZone; // Starting zone of the journey
  toZone: IZone; // Ending zone of the journey
  date: ITravelDate; // Date of the journey
  time: ITimeOfDay; // Time of the journey
  getZonePair(): IZonePair;
}
