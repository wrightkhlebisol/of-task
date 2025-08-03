import { ZonePair } from "./zone_pair";
import { Zone } from "./zone";

describe("ZonePair", () => {
  it("should create a valid zone pair and sort zones", () => {
    const zone2 = new Zone(2);
    const zone1 = new Zone(1);
    const pair = new ZonePair(zone1, zone2);
    expect(pair.getZoneKey()).toBe("1-2");
  });

  test('should handle same zones', () => {
    const zone1 = new Zone(1);
    const zone2 = new Zone(1);
    const zonePair = new ZonePair(zone1, zone2);

    expect(zonePair.getZoneKey()).toBe('1-1');
  });
});
