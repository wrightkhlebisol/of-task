import { Zone } from "./zone";

describe("Zone", () => {
  it("should create a valid zone", () => {
    const zone = new Zone(1);
    expect(zone.id).toBe(1);
  });

  it("should throw an error for invalid zone ID", () => {
    expect(() => new Zone(0)).toThrow("Zone ID must be a positive integer.");
    expect(() => new Zone(-1)).toThrow("Zone ID must be a positive integer.");
  });
});
