# FARE CALCULATION ENGINE
This project implements a fare calculation engine for a public transportation system, designed to calculate fares based on various parameters such as zones, time of day, travel date, and fare rules. The engine supports single, daily, and weekly fare calculations, applying fare caps and grouping rules as necessary.

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
## Design Patterns