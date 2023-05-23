"use client";

import { useAuth } from "@/hooks/useAuthcomponents";
import { useState, ChangeEvent } from "react";

const AuthInputs = ({ isSignIn }: { isSignIn: boolean }) => {
  const { errors, login, register } = useAuth();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputs({
      ...inputs,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    if (isSignIn) {
      login(inputs);
    } else {
      register(inputs);
    }
  };

  const renderContent = (signInContent: string, signUpContent: string) =>
    isSignIn ? signInContent : signUpContent;

  return (
    <>
      <div className="field w-full mb-5">
        <label>
          <p className="font-bold pb-2">Username</p>
          <input
            className="w-full p-3 font-light bg-primary  rounded-md outline-none"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={inputs.username}
          />
        </label>
      </div>
      <div className="field w-full mb-5">
        <label>
          <p className="font-bold pb-2">Password</p>
          <input
            className="w-full p-3 font-light bg-primary  rounded-md outline-none"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={inputs.password}
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="self-start bg-primary  py-3 px-6 rounded-md font-bold mb-5"
      >
        {renderContent("Login", "Register")}
      </button>
      {errors?.length ? (
        <div className="text-red-700 font-bold p-2 rounded-md w-full border-2 border-red-700 ">{`${errors[0].field}: ${errors[0].message}`}</div>
      ) : null}
    </>
  );
};

export default AuthInputs;
