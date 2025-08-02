import { IZone } from '../../interfaces/IZone.interface';

export class Zone implements IZone {
  constructor(public id: number) {
    if (id <= 0) {
      throw new Error('Zone ID must be a positive integer.');
    }
  }

  toString(): string {
    return `Zone ${this.id}`;
  }
}
