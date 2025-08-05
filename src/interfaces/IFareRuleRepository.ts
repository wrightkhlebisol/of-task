import { IZonePair } from "./IZone";
import { IFareRate, IFareCap } from "./IFare";

export interface IFareRuleRepository {
  getFareRate(zonePair: IZonePair): IFareRate;
  getDailyCap(highestZonePair: IZonePair): IFareCap;
  getWeeklyCap(highestZonePair: IZonePair): IFareCap;
  addFareRate(zonePair: IZonePair, fareRate: IFareRate): void;
  addDailyCap(zonePair: IZonePair, cap: IFareCap): void;
  addWeeklyCap(zonePair: IZonePair, cap: IFareCap): void;
}