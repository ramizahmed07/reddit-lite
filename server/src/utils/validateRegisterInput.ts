import { FieldError, RegisterUserInput } from "src/resolvers/user/user.dto";
import { validateEmail } from "./validateEmail";

export function validateRegisterInput({
  email,
  username,
  password,
}: RegisterUserInput): FieldError[] | null {
  if (!validateEmail(email))
    return [{ field: "email", message: "Email must be valid" }];

  if (username.length <= 4)
    return [{ field: "username", message: "length must be greater than 4" }];

  if (password.length <= 5)
    return [{ field: "password", message: "length must be greater than 5" }];

  return null;
}
