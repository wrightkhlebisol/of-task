import { Fare } from '../domains/fare/fare';
import { FareRuleRepository } from '../repositories/fare_rule.repository';
import { PeakHourService } from '../services/peak_hour.service';
import { Journey } from '../domains/journey/journey';
import { JourneyGroupingService } from '../services/journey_grouping.service';
import { ZoneAnalysisService } from '../services/zone_analysis.service';
import { SingleFareCalculator } from '../services/calculators/single_fare.service';
import { DailyFareCalculator } from '../services/calculators/daily_fare.service';
import { WeeklyFareCalculator } from '../services/calculators/weekly_fare.service';
import { IFareRuleRepository } from '@interfaces/IFareRuleRepository';
import { IPeakHourService } from '@interfaces/IPeakHour';
import { IJourneyGroupingService } from '@interfaces/IJourneyGroupingService';
import { IZoneAnalysisService } from '@interfaces/IZoneAnalysisService';
import { IJourney } from '@interfaces/IJourney';
import { IFareCalculator } from '@interfaces/IFareCalculator';
import { IFareEngine } from '@interfaces/IFareEngine';

/**
 * MoysterCardFareEngine is the main fare calculation engine for Moyster Card.
 * It handles fare calculations for single, daily, and weekly fares,
 * applying appropriate fare rules and caps.
 */
export class MoysterCardFareEngine implements IFareEngine {
  private readonly fareRuleRepository: IFareRuleRepository;
  private readonly peakHourService: IPeakHourService;
  private readonly journeyGroupingService: IJourneyGroupingService;
  private readonly zoneAnalysisService: IZoneAnalysisService;
  private readonly singleFareCalculator: IFareCalculator;
  private readonly dailyFareCalculator: IFareCalculator;
  private readonly weeklyFareCalculator: IFareCalculator;

  /**
   * Constructor for MoysterCardFareEngine.
   * Allows dependency injection while providing sensible defaults.
   * @param fareRuleRepository - Optional custom fare rule repository.
   * @param peakHourService - Optional custom peak hour service.
   */
  constructor(
    fareRuleRepository?: IFareRuleRepository,
    peakHourService?: IPeakHourService
  ) {
    // Allow dependency injection while providing sensible defaults
    this.fareRuleRepository = fareRuleRepository || new FareRuleRepository();
    this.peakHourService = peakHourService || new PeakHourService();
    this.journeyGroupingService = new JourneyGroupingService();
    this.zoneAnalysisService = new ZoneAnalysisService(this.fareRuleRepository, this.peakHourService);

    this.singleFareCalculator = new SingleFareCalculator(
      this.fareRuleRepository,
      this.peakHourService
    );

    this.dailyFareCalculator = new DailyFareCalculator(
      this.singleFareCalculator,
      this.fareRuleRepository,
      this.zoneAnalysisService
    );

    this.weeklyFareCalculator = new WeeklyFareCalculator(
      this.dailyFareCalculator,
      this.fareRuleRepository,
      this.zoneAnalysisService,
      this.journeyGroupingService
    );
  }

  /**
   * Calculate the total fare for a list of journeys with weekly and daily capping applied
   * @param journeys - Array of journeys to calculate fare for.
   * @returns Total fare amount for the provided journeys.
   * If no journeys are provided, returns 0.
   */
  calculateFare(journeys: IJourney[]): number {
    if (journeys.length === 0) {
      return 0;
    }

    // Sort journeys by date and time for consistent processing
    const sortedJourneys = [...journeys].sort((a, b) => {
      const dateCompare = a.date.toString().localeCompare(b.date.toString());
      if (dateCompare !== 0) return dateCompare;
      return a.time.toString().localeCompare(b.time.toString());
    });

    // Group by week and calculate total fare
    const weeklyGroups = this.journeyGroupingService.groupByWeek(sortedJourneys);
    let totalFare = new Fare(0);

    for (const weekJourneys of weeklyGroups.values()) {
      const weeklyFare = this.weeklyFareCalculator.calculateFare(weekJourneys);
      totalFare = totalFare.add(weeklyFare);
    }

    return totalFare.amount;
  }

  /**
   * Calculate fare for a single journey without any capping
   * @param journey - The journey to calculate fare for.
   * @returns The fare amount for the single journey.
   * If the journey is invalid, returns 0.
   */
  calculateSingleJourneyFare(journey: IJourney): number {
    return this.singleFareCalculator.calculateFare(journey).amount;
  }

  /**
   * Check if a journey occurs during peak hours
   * @param journey - The journey to check for peak hours.
   * @returns True if the journey is during peak hours, false otherwise.
   */
  isJourneyDuringPeakHours(journey: IJourney): boolean {
    return this.peakHourService.isPeakHour(journey.date, journey.time);
  }

  /**
   * Factory method to create Journey from raw data
   * @param data - Raw data for the journey.
   * @returns An instance of Journey created from the raw data.
   * If the data is invalid, throws an error.
   * @throws Error if the raw data is invalid.
   */
  static createJourney(data: {
    date: string;
    time: string;
    fromZone: number;
    toZone: number;
  }): IJourney {
    return Journey.fromRawData(data);
  }

  /**
   * Get access to the fare rule repository for configuration
   * @return The fare rule repository used by this engine.
   * This allows external configuration of fare rules.
   */
  getFareRuleRepository(): IFareRuleRepository {
    return this.fareRuleRepository;
  }
}