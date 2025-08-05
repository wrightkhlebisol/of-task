import { FareCap } from './fare_cap';
import { Fare } from './fare';

describe("FareCap", () => {
  it("should create a valid fare cap", () => {
    const fareCap = new FareCap(new Fare(100));
    expect(fareCap.amount.amount).toBe(100);
  });

  it("should apply the fare cap correctly", () => {
    const fareCap = new FareCap(new Fare(100));
    const fare = new Fare(125);
    const cappedFare = fareCap.apply(fare);
    expect(cappedFare.amount).toBe(100);
  });

  it("should return the original fare if it is below the cap", () => {
    const fareCap = new FareCap(new Fare(100));
    const fare = new Fare(80);
    const cappedFare = fareCap.apply(fare);
    expect(cappedFare.amount).toBe(80);
  });
});