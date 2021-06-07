import { Enum } from "typescript-string-enums";
export const MessageType = Enum("INFO", "SUCCESS", "ERROR", "WARNING");
export type MessageType = Enum<typeof MessageType>;

/*
export enum MessageType {
  INFO,
  SUCCESS,
  ERROR,
  WARNING,
}
*/