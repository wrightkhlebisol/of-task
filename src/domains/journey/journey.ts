import { IJourney } from "../../interfaces/IJourney.interface";
import { IZonePair, IZone } from "../../interfaces/IZone.interface";
import { ITravelDate, ITimeOfDay } from "../../interfaces/Utils.interface";

import { TimeOfDay } from "../utils/time_of_day";
import { TravelDate } from "../utils/travel_date";
import { ZonePair } from "../zones/zone_pair";
import { Zone } from "../zones/zone";

export interface RawData {
  date: string;
  time: string;
  fromZone: number;
  toZone: number;
}

export class Journey implements IJourney {
  constructor(
    public date: ITravelDate,
    public time: ITimeOfDay,
    public fromZone: IZone,
    public toZone: IZone
  ) { }

  /**
   * Gets the zone pair for the journey.
   * @returns The zone pair representing the journey's zones.
   */
  getZonePair(): IZonePair {
    return new ZonePair(this.fromZone, this.toZone);
  }

  /**
   * Creates a journey instance from raw data.
   * @param rawData The raw data to create the journey from.
   * @returns An instance of IJourney.
   */
  static fromRawData(rawData: RawData): IJourney {
    // Logic to convert raw data into a Journey instance
    return new Journey(
      new TravelDate(rawData.date),
      TimeOfDay.fromString(rawData.time),
      new Zone(rawData.fromZone),
      new Zone(rawData.toZone)
    );
  }

  /**
   * Converts the journey to a string representation.
   * @returns A string representing the journey.
   */
  toString(): string {
    return `${this.date} ${this.time}: ${this.fromZone}->${this.toZone}`;
  }
}