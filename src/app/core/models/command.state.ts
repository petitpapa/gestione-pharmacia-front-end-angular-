import { Enum } from "typescript-string-enums";
export const CommandState = Enum("NEW", "DELIVERED", "ERROR", "WARNING");
export type CommandState = Enum<typeof CommandState>;
