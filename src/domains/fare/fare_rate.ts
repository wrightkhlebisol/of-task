import { IFareRate, IFare } from "../../interfaces/IFare";

export class FareRate implements IFareRate {
  constructor(
    public readonly peak: IFare,
    public readonly offPeak: IFare,
  ) { }

  /**
   * Gets the fare based on whether it is peak or off-peak.
   * @param isPeak A boolean indicating if the fare is for peak time.
   * @returns The fare for the specified time.
   */
  getFare(isPeak: boolean): IFare {
    return isPeak ? this.peak : this.offPeak;
  }
}