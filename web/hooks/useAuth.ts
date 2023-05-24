import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

import {
  ChangePasswordDocument,
  FieldError,
  ForgotPasswordDocument,
  LoginDocument,
  LogoutDocument,
  MeDocument,
  RegisterDocument,
} from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

export const useAuth = () => {
  const [errors, setErrors] = useState<FieldError[] | null>(null);
  const router = useRouter();

  const login = async ({
    usernameOrEmail,
    password,
  }: {
    usernameOrEmail: string;
    password: string;
  }) => {
    const { login } = await client.request(LoginDocument, {
      usernameOrEmail,
      password,
    });
    if (login?.errors) {
      setErrors(login?.errors as FieldError[]);
    } else {
      mutate(MeDocument, { me: login.user }, false);
      router.push("/");
    }
  };

  const register = async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { register } = await client.request(RegisterDocument, {
      options: { email, username, password },
    });
    if (register?.errors) {
      setErrors(register?.errors as FieldError[]);
    } else {
      mutate(MeDocument, { me: register.user }, false);
      router.push("/");
    }
  };

  const logout = async () => {
    const data = await client.request(LogoutDocument);
    if (data.logout === true) {
      mutate(MeDocument, { me: null }, false);
    }
  };

  const forgotPassword = async (variables: { email: string }) => {
    const { forgotPassword } = await client.request(
      ForgotPasswordDocument,
      variables
    );
    if (!forgotPassword)
      setErrors([{ field: "", message: "Something went wrong" }]);
    return forgotPassword;
  };

  const changePassword = async (variables: {
    token: string;
    newPassword: string;
  }) => {
    const { changePassword } = await client.request(
      ChangePasswordDocument,
      variables
    );
    if (changePassword?.errors) {
      setErrors(changePassword?.errors as FieldError[]);
    } else {
      mutate(MeDocument, { me: changePassword?.user }, false);
      router.push("/");
    }
  };

  return {
    errors,
    login,
    register,
    logout,
    changePassword,
    forgotPassword,
  };
};
