import { useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";

import {
  FieldError,
  LoginDocument,
  LogoutDocument,
  MeDocument,
  RegisterDocument,
} from "@/gql/graphqlcomponents";
import { client } from "@/lib/clientcomponents";

interface UserInput {
  username: string;
  password: string;
}

export const useAuth = () => {
  const [errors, setErrors] = useState<FieldError[] | null>(null);
  const router = useRouter();

  const login = async ({ username, password }: UserInput) => {
    const { login } = await client.request(LoginDocument, {
      username,
      password,
    });

    if (login?.errors) {
      setErrors(login?.errors as FieldError[]);
    } else {
      mutate(MeDocument, { me: login.user }, false);
      router.push("/");
    }
  };

  const register = async ({ username, password }: UserInput) => {
    const { register } = await client.request(RegisterDocument, {
      username,
      password,
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

  return {
    errors,
    login,
    register,
    logout,
  };
};
