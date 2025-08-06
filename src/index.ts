import { MoysterCardFactory } from './factories/moyster_card.factory';
import { FareRuleRepository } from './repositories/fare_rule.repository';
import { ZonePair } from './domains/zones/zone_pair';
import { FareRate } from './domains/fare/fare_rate';
import { FareCap } from './domains/fare/fare_cap';
import { Fare } from './domains/fare/fare';
import { Zone } from './domains/zones/zone';
import { MoysterCardFareEngine } from './engines/moyster_card';

function runExamples() {
  const fareEngine = MoysterCardFactory.createStandardEngine();

  // Example 1: Daily Cap reached (from the document)
  const example1RawData = [
    { date: '2024-01-15', time: '10:20', fromZone: 2, toZone: 1 },
    { date: '2024-01-15', time: '10:45', fromZone: 1, toZone: 1 },
    { date: '2024-01-15', time: '16:15', fromZone: 1, toZone: 1 },
    { date: '2024-01-15', time: '18:15', fromZone: 1, toZone: 1 },
    { date: '2024-01-15', time: '19:00', fromZone: 1, toZone: 2 }
  ];

  const example1Journeys = MoysterCardFactory.createJourneysFromRawData(example1RawData);

  console.log('Example 1 - Daily Cap Test:');
  console.log('Expected: 120, Actual:', fareEngine.calculateFare(example1Journeys));

  // Example 2: Testing single journey calculation
  const singleJourney = MoysterCardFareEngine.createJourney({
    date: '2024-01-15',
    time: '08:00',
    fromZone: 1,
    toZone: 2
  });

  console.log('\nSingle Journey Tests:');
  console.log('Peak 1-2 fare:', fareEngine.calculateSingleJourneyFare(singleJourney));
  console.log('Is peak hour:', fareEngine.isJourneyDuringPeakHours(singleJourney));

  // Example 3: Demonstrating extensibility - custom fare rules
  const customFareRepo = new FareRuleRepository();
  customFareRepo.addFareRate(
    new ZonePair(new Zone(3), new Zone(3)),
    new FareRate(new Fare(40), new Fare(35))
  );
  customFareRepo.addDailyCap(
    new ZonePair(new Zone(3), new Zone(3)),
    new FareCap(new Fare(150))
  );
  customFareRepo.addWeeklyCap(
    new ZonePair(new Zone(3), new Zone(3)),
    new FareCap(new Fare(700))
  );

  console.log('\nCustom Engine Created with Zone 3 support');
}

runExamples();