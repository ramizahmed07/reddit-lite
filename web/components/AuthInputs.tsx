"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuthcomponents";
import { extractErrorMessage } from "@/utils/extractErrorMessagecomponents";
import FormMessage from "./FormMessage";

interface LoginUserInput {
  usernameOrEmail: string;
  password: string;
}

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

const AuthInputs = ({ isSignIn }: { isSignIn: boolean }) => {
  const { errors, register, login } = useAuth();
  const [inputs, setInputs] = useState<LoginUserInput | RegisterUserInput>(
    isSignIn
      ? {
          usernameOrEmail: "",
          password: "",
        }
      : { email: "", username: "", password: "" }
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (isSignIn) {
      login(inputs as LoginUserInput);
    } else {
      register(inputs as RegisterUserInput);
    }
  };

  const renderContent = (signInContent: string, signUpContent: string) =>
    isSignIn ? signInContent : signUpContent;

  return (
    <>
      {!isSignIn && (
        <div className="field w-full mb-5">
          <label>
            <p className="font-bold pb-2">Email</p>
            <input
              className="w-full p-3 font-light bg-primary  rounded-md outline-none"
              type="email"
              name="email"
              placeholder="email"
              onChange={handleChange}
              value={(inputs as RegisterUserInput).email}
            />
          </label>
        </div>
      )}

      <div className="field w-full mb-5">
        <label>
          <p className="font-bold pb-2">
            {renderContent("Username or Email", "Username")}
          </p>
          <input
            className="w-full p-3 font-light bg-primary  rounded-md outline-none"
            type="text"
            name={renderContent("usernameOrEmail", "username")}
            placeholder={renderContent("username or email", "username")}
            onChange={handleChange}
            value={
              isSignIn
                ? (inputs as LoginUserInput).usernameOrEmail!
                : (inputs as RegisterUserInput).username
            }
          />
        </label>
      </div>

      <div className="field w-full mb-3">
        <label>
          <p className="font-bold pb-2">Password</p>
          <input
            className="w-full p-3 font-light bg-primary  rounded-md outline-none"
            type="password"
            name="password"
            placeholder="password"
            onChange={handleChange}
            value={inputs.password}
          />
        </label>
      </div>
      {isSignIn && (
        <div className="text-sm w-full text-right mb-3 hover:underline">
          <Link href="/forgot-password">forgot password?</Link>
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="self-start bg-primary  py-3 px-6 rounded-md font-bold mb-5"
      >
        {renderContent("Login", "Register")}
      </button>

      <FormMessage
        visible={errors !== null && errors?.length !== 0}
        type={"error"}
        message={extractErrorMessage(errors!)}
      />
    </>
  );
};

export default AuthInputs;
