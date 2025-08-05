import { IFareCap, IFare } from '../../interfaces/IFare';

export class FareCap implements IFareCap {
  /**
   * Creates a FareCap instance with a specified amount.
   * @param amount The maximum fare amount for the cap.
   */
  constructor(public readonly amount: IFare) { }

  /**
   * Applies the fare cap to a given fare.
   * @param fare The fare to apply the cap to.
   * @returns The fare after applying the cap, which is the minimum of the fare and the cap amount.
   */
  apply(fare: IFare): IFare {
    // Return fare up to max cap for the given fare
    return fare.min(this.amount);
  }
}