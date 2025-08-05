import { IZone } from '../../interfaces/IZone';

export class Zone implements IZone {
  constructor(public id: number) {
    if (id <= 0) {
      throw new Error('Zone ID must be a positive integer.');
    }
  }

  toString(): string {
    return this.id.toString();
  }

  equals(other: IZone): boolean {
    return this.id === other.id;
  }
}
