import * as _ from "lodash-es";
import * as _moment from "moment";
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from "moment";

export const momentForDate = _rollupMoment || _moment;

export class Utils {
  static convertNumberTodefaultIfNull(s: number): string {
    return s === null || s === undefined ? "0" : _.toString(s);
  }
}

export const MATERIAL_DATE_FORMATS = {
  parse: {
    dateInput: "LL",
  },
  display: {
    dateInput: "DD-MM-YYYY",
    monthYearLabel: "YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "YYYY",
  },
};
