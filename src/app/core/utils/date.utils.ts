import * as _ from "lodash-es";
export class DateUtils {
  static stringToDate(date: string): Date {
    const dates = _.split(date, "-");
    return new Date(dates[0], _.parseInt(dates[1]) - 1, dates[2]);
  }
}
