import {Enum} from "typescript-string-enums";

export const CommandSystemType = Enum('MANUAL', 'MIN_MAX','SALE_OF_DAY', 'STOCK_COVERAGE_DAY');
export type CommandSystemType = Enum<typeof CommandSystemType>;
