import { ZonePair } from "./zonePair";
import { Zone } from "./zone";

describe("ZonePair", () => {
  it("should create a valid zone pair", () => {
    const zone1 = new Zone(1);
    const zone2 = new Zone(2);
    const pair = new ZonePair(zone1, zone2);
    expect(pair.getZoneKey()).toBe("1-2");
  });

  it("should throw an error for invalid zone pair", () => {
    const zone1 = new Zone(1);
    const zone2 = new Zone(1);
    expect(() => new ZonePair(zone1, zone2)).toThrow("Both zones must be different.");
  });
});
