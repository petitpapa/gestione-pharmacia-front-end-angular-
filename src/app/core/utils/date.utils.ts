import * as _ from "lodash-es";
import moment from "moment";

export class DateUtils {
  static stringToDate(date: string): Date {
    const dates = _.split(date, "-");
    return new Date(dates[0], _.parseInt(dates[1]) - 1, dates[2]);
  }

   static formatDate(date: Date): string {
    return moment(date).format(" D/MM/YYYY,  h:mm:ss");
  }
}
