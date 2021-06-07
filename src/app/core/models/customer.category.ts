import { Enum } from "typescript-string-enums";
export const CustomerCategory = Enum("REGISTERED", "CLIENT_DE_PASSAGE", "CLIENT_INDIVIDUEL", "COMPANY" );
export type CustomerCategory = Enum<typeof CustomerCategory>;