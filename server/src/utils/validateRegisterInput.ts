import { FieldError, RegisterUserInput } from "src/resolvers/types/user";
import { validateEmail } from "./validateEmail";

export function validateRegisterInput({
  email,
  username,
  password,
}: RegisterUserInput): FieldError[] | null {
  if (!validateEmail(email))
    return [{ field: "email", message: "Email must be valid" }];

  if (username.length <= 2)
    return [{ field: "username", message: "length must be greater than 2" }];

  if (password.length <= 3)
    return [{ field: "password", message: "length must be greater than 3" }];

  return null;
}
