import { Enum } from "typescript-string-enums";
export const FieldsQuery = Enum("category_id", "form_id", "rayon_id", "therapeutic_familly_id");
export type FieldsQuery = Enum<typeof FieldsQuery>;
