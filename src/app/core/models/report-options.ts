import * as moment from "moment";

export class ReportOptions {
  public reportPeriods = ["daily", "monthly", "yearly"];
  public reportSegments = ['1M', "3M", "6M", "1Y", "YTD", 'ALL'];

  public get initialPeriod() { return this.reportPeriods[0]; };
  public get initialSegment() { return this.reportSegments[0]; };
  public startOfYear: number = moment().startOf('year').startOf('day').valueOf();
  public oneYearAgo: number = moment().subtract(1, 'year').startOf('day').valueOf();
  public sixMonthsAgo: number = moment().subtract(6, 'months').startOf('day').valueOf();
  public threeMonthsAgo: number = moment().subtract(3, 'months').startOf('day').valueOf();
  public oneMonthAgo: number = moment().subtract(1, 'month').startOf('day').valueOf();
  public now: number = moment().startOf('day').valueOf();

  startDate: number = moment().subtract(1, 'month').startOf('day').valueOf();
  endDate: number = moment().valueOf();
  period: string = this.initialPeriod;
  segment: string = this.initialSegment;


  public setPeriod(period: string) {
    this.period = period;
  }

  public get endDateString() { return moment(this.endDate).format("YYYY-MM-DD"); };
  public get startDateString() { return moment(this.startDate).format("YYYY-MM-DD"); };


  public setSegment(segment: string) {
    this.segment = segment;
    this.endDate = this.now;
    if (segment === '1M') {
      this.startDate = this.oneMonthAgo;
    } else if (segment === '3M') {
      this.startDate = this.threeMonthsAgo;
    } else if (segment === '6M') {
      this.startDate = this.sixMonthsAgo;
    } else if (segment === '1Y') {
      this.startDate = this.oneYearAgo;
    } else if (segment === 'YTD') {
      this.startDate = this.startOfYear;
    } else {
      this.startDate = 0;
    }

  }

  public setEndDate(endDateString: string) {
    this.endDate = Number.parseInt(moment(endDateString).format('x'));
  }

  public setStartDate(startDateString: string) {
    this.startDate = Number.parseInt(moment(startDateString).format('x'));
  }


  constructor(options: ReportOptionsInterface) {
    if (options.startDate) {
      this.startDate = options.startDate;
    }
    if (options.endDate) {
      this.endDate = options.endDate;
    }
    if (options.period) {
      this.period = options.period;
    }
    if (options.segment) {
      this.segment = options.segment;
    }
  }

  public static getReportQueryParameters(reportOptions: ReportOptions): string {
    return `startDate=${reportOptions.startDate}&endDate=${reportOptions.endDate}&period=${reportOptions.period}`;
  }
}


export interface ReportOptionsInterface {
  startDate?: number;
  endDate?: number;
  period?: string;
  segment?: string;
}
