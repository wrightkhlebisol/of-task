import { IFare } from "../../interfaces/IFare.interface";

export class Fare implements IFare {
  constructor(
    public amount: number
  ) {
    if (amount < 0) {
      throw new Error("Fare amount cannot be negative.");
    }
  }

  /**
   * Adds another fare to this fare.
   * @param fare The fare to add.
   * @returns A new Fare instance with the combined amount.
   */
  add(fare: IFare): IFare {
    return new Fare(this.amount + fare.amount);
  }

  /**
   * Get minimum fare between this fare and another fare.
   * @param fare The fare to compare with.
   * @returns The minimum fare.
   */
  min(fare: IFare): IFare {
    return new Fare(Math.min(this.amount, fare.amount));
  }
}