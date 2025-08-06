import { Journey } from "../domains/journey/journey";

import { IJourney } from "../interfaces/IJourney";
import { MoysterCardFareEngine } from "../engines/moyster_card";
import { FareRuleRepository } from "../repositories/fare_rule.repository";
import { PeakHourService } from "../services/peak_hour.service";
import { IFareEngine } from "@interfaces/IFareEngine";
import { IFareRuleRepository } from "@interfaces/IFareRuleRepository";
import { IPeakHourService } from "@interfaces/IPeakHour";

/**
 * Factory class for creating instances of MoysterCardFareEngine and related objects.
 */
export class MoysterCardFactory {
  /**
   * Creates a standard MoysterCardFareEngine with default fare rules and peak hours.
   * @returns A new instance of MoysterCardFareEngine with default configurations.
   */
  static createStandardEngine(): IFareEngine {
    return new MoysterCardFareEngine();
  }

  /**
   * Creates a custom MoysterCardFareEngine with optional custom fare rules and peak hours.
   * @param customFareRules - Custom fare rules to be applied.
   * @param customPeakHours - Custom peak hour service.
   * @returns A new instance of MoysterCardFareEngine with the provided customizations.
   */
  static createCustomEngine(
    customFareRules?: IFareRuleRepository,
    customPeakHours?: IPeakHourService
  ): MoysterCardFareEngine {
    return new MoysterCardFareEngine(customFareRules, customPeakHours);
  }

  /**
   * Creates journeys from raw data, ensuring valid inputs.
   * @param rawJourneys - Array of raw journey data.
   * @returns An array of Journey instances created from the raw data.
   */
  static createJourneysFromRawData(rawJourneys: Array<{
    date: string;
    time: string;
    fromZone: number;
    toZone: number;
  }>): IJourney[] {
    return rawJourneys.map(data => Journey.fromRawData(data));
  }
}