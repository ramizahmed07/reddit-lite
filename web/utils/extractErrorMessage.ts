import { FieldError } from "@/gql/graphqlcomponents";

export function extractErrorMessage(errors: FieldError[]): string {
  if (!errors?.length) return "";

  return `${errors[0].field ? `${errors[0].field}:` : ""}  ${
    errors[0].message
  }`;
}
