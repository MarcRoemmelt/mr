import autoBind from 'auto-bind';
import { BehaviorSubject } from 'rxjs';

class DateTime {
  private MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dez',
  ];

  seconds: number;
  minutes: number;
  hours: number;
  day: number;
  month: number;
  monthString: string;
  year: number;

  public toString() {
    return `${this.monthString} ${this.day} ${this.hours}:${this.minutes
      .toString()
      .padStart(2, '0')}`;
  }

  constructor(dateTime: Date = new Date()) {
    this.year = dateTime.getFullYear();
    this.month = dateTime.getMonth() + 1;
    this.monthString = this.MONTHS.at(dateTime.getMonth());
    this.day = dateTime.getDate();
    this.hours = dateTime.getHours();
    this.minutes = dateTime.getMinutes();
    this.seconds = dateTime.getSeconds();
  }
}
export class Clock {
  private INTERVAL_TIMEOUT = 1000;
  private dateTimeSubject = new BehaviorSubject<DateTime | null>(
    new DateTime()
  );

  public time = this.dateTimeSubject.asObservable();

  constructor() {
    autoBind(this);
  }

  public start() {
    setInterval(this.tick, this.INTERVAL_TIMEOUT);
  }

  private tick() {
    this.dateTimeSubject.next(new DateTime());
  }
}
