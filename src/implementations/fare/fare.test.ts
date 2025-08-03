import { Fare } from "./fare";

describe("Fare", () => {
  it("should create a valid fare", () => {
    const fare = new Fare(10);
    expect(fare.amount).toBe(10);
  });

  it("should throw an error for negative fare amount", () => {
    expect(() => new Fare(-5)).toThrow("Fare amount cannot be negative.");
  });

  it("should add another fare correctly", () => {
    const fare1 = new Fare(10);
    const fare2 = new Fare(5);
    const result = fare1.add(fare2);
    expect(result.amount).toBe(15);
  });

  it("should return the minimum fare correctly", () => {
    const fare1 = new Fare(10);
    const fare2 = new Fare(15);
    const result = fare1.min(fare2);
    expect(result.amount).toBe(10);
  });
});