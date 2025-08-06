import { ITimeOfDay, ITravelDate } from '@interfaces/Utils';

export interface IPeakHourService {
  isPeakHour(date: ITravelDate, time: ITimeOfDay): boolean;
}