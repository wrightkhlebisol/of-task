# FARE CALCULATION ENGINE
This project implements a fare calculation engine for a public transportation system, designed to calculate fares based on various parameters such as zones, time of day, travel date, and fare rules. The engine supports single, daily, and weekly fare calculations, applying fare caps and grouping rules as necessary.

It adheres strictly to ***```SOLID principles```***, ensuring that each component has a single responsibility and can be easily tested and maintained. The architecture is designed to be modular, allowing for easy extension and modification of fare rules and calculations.

## Core Objects
- **Zone**: Represents a geographical area in the transportation system.
- **ZonePair**: Represents a pair of zones for fare calculation.
- **Fare**: Represents a fare amount integer.
- **FareRate**: Represents a rule that applies to fare calculations, such as time-based or distance-based rules.
- **FareCap**: Represents a cap on fares, such as daily or weekly caps.
- **Journey**: Represents a journey taken by a passenger, including the zones traveled through and the fare applied.
## Relationships
- **Zone** and **ZonePair**: A ZonePair consists of two Zones.
- **Fare** and **FareRate**: A Fare is calculated based on one or more FareRates.
- **FareRate** and **ZonePair**: FareRates can apply to specific ZonePairs, allowing for different fares based on the zones traveled through.
- **Journey** contains **Zone**, **TimeOfDay**, **TravelDate**
- **Journey** creates **ZonePair** from **Zones**
- **FareRate** and **FareCap** contain **Fare** objects
## Actions
- **CalculateFare**: Calculates the fare for a given Journey based on the FareRates and FareCaps.
- **ApplyFareCap**: Applies a fare cap to the calculated fare, ensuring it does not exceed the specified limits.
- **GroupJourneys**: Groups multiple journeys based on rules, such as daily or weekly fare calculations, to apply fare caps and discounts.
- **AnalyzeZones**: Analyzes zones for fare calculations, determining applicable fare rates and rules based on the zones traveled through.
## Design Patterns

### Three-Tier Architecture
The project follows a three-tier architecture, separating concerns into:
1. **Domain Layer**: Contains the core business logic and entities with no dependencies, such as:
    - **Zone**: Represents a geographical area in the transportation system.
    - **ZonePair**: Represents a pair of zones for fare calculation.

    - **Fare**: Represents a fare amount integer.
    - **FareRate**: Represents a rule that applies to fare calculations, such as time-based or distance-based rules.
    - **FareCap**: Represents a cap on fares, such as daily or weekly caps.
    - **FareRule**: Represents rules that apply to fare calculations, such as time-based or distance-based rules.

    - **Journey**: Represents a journey taken by a passenger, including the zones traveled through and the fare applied.
2. **Service Layer**: Business logic and rules are implemented here, coordinating between the domain layer and application layer. 
   This includes fare calculation services, zone analysis, and journey grouping.
   - **FareCalculator**: Interface for fare calculation strategies.
   - **SingleFareCalculator**: Calculates fares for single journeys.
   - **DailyFareCalculator**: Calculates daily fares with caps.
   - **WeeklyFareCalculator**: Calculates weekly fares with caps.
   - **ZoneAnalysisService**: Analyzes zones for fare calculations.
   - **JourneyGroupingService**: Groups journeys based on rules for fare calculations.
   - **FareRateService**: Manages fare rates and rules.
   - **FareCapService**: Manages fare caps for daily and weekly fares.
   - **FareRuleService**: Manages fare rules and their application.
   - **FareCalculationEngine**: Coordinates fare calculations across different services.
   - **FareCalculationEngine**: The main entry point for fare calculations, coordinating between the domain and service layers.
   - **Journey**: Represents a passenger's journey, including zones and fare applied.
3. **Application Layer**: Orchestration and factory layer, providing a simple interface for fare calculations and journey management.
   - **FareCalculationEngine**: The main entry point for fare calculations, coordinating between the domain and service layers.
   - **JourneyFactory**: Creates journeys from raw data, ensuring valid inputs.
   - **FareCalculationController**: Provides an API for fare calculations, handling requests and responses.

## Testing
The project includes unit tests for individual components collocated in the same directory as the implementation, to ease access and improve maintainability, it also contains integration tests for the fare calculation engine.

Tests cover various scenarios, including:
- Single fare calculations
- Daily fare calculations with caps
- Weekly fare calculations with caps
- Edge cases such as invalid inputs and cross-week journeys

## Running the Project
### Prerequisites
- Node.js (version 14 or higher)
- TypeScript

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
```
2. Install dependencies:
```bash
npm install
```
3. A simple test script has been provided in `index.ts` for demonstration purposes. To run the project, use the following command:
```bash
npm start
```
This will run the provided test scenarios and display the calculated fares in the console. The `test script can be modified` to include additional journeys or fare rules as needed.
