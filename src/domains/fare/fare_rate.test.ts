import { FareRate } from "./fare_rate";
import { Fare } from "./fare";

describe('FareRate', () => {
  it('should return peak fare rate', () => {
    const peakRate = new Fare(100);
    const offPeakRate = new Fare(80);
    const fareRate = new FareRate(peakRate, offPeakRate);

    expect(fareRate.getFare(true)).toBe(peakRate);
  });

  it('should return off peak fare rate', () => {
    const peakRate = new Fare(100);
    const offPeakRate = new Fare(80);
    const fareRate = new FareRate(peakRate, offPeakRate);

    expect(fareRate.getFare(false)).toBe(offPeakRate);
  });
});
