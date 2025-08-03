/**
 * IFare interface defines the structure for fare calculations in a transportation system.
 * It includes properties for the fare amount and methods for fare operations.
 */
export interface IFare {
  amount: number; // Fare amount
  add(fare: IFare): IFare; // Method to add another fare to this fare
  min(fare: IFare): IFare; // Method to get the minimum fare between this fare and a given amount
}

/**
 * IFareRate interface defines the structure for fare rates in a transportation system.
 * It includes properties for peak and off-peak fares and a method to get the fare based on peak status.
 */
export interface IFareRate {
  peak: IFare; // Fare during peak hours
  offPeak: IFare; // Fare during off-peak hours
  getFare(isPeak: boolean): IFare; // Method to get the fare for peak hours // Method to get the fare for off-peak hours
}

/**
 * IFareCap interface defines the structure for fare caps in a transportation system.
 * It includes properties for the maximum fare amount and methods to get and apply the fare cap.
 */
export interface IFareCap {
  amount: IFare; // Maximum fare amount for a specific period
  apply(fare: IFare): IFare; // Method to apply the fare cap to a given fare
}
