export default class Fare {
  constructor(
    public baseFare: number,
    public distance: number,
    public time: number
  ) { }

  calculateTotalFare(): number {
    const distanceFare = this.distance * 0.5;
    const timeFare = this.time * 0.2;
    return this.baseFare + distanceFare + timeFare;
  }
}

const fare = new Fare(2.5, 10, 15);
console.log(`Total Fare: $${fare.calculateTotalFare().toFixed(2)}`);