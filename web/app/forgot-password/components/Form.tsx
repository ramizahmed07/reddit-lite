"use client";

import { useState } from "react";

import { useAuth } from "@/hooks/useAuthcomponents";
import FormMessage from "@/components/FormMessagecomponents";
import { extractErrorMessage } from "@/utils/extractErrorMessagecomponents";

export default function Form() {
  const { forgotPassword, errors } = useAuth();
  const [messageVisible, setMessageVisible] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    await forgotPassword({ email });
    setEmail("");
    setMessageVisible(true);
  };

  return (
    <>
      <div className="field w-full mb-5">
        <label>
          <p className="font-bold pb-2">Email</p>
          <input
            className="w-full p-3 font-light bg-primary  rounded-md outline-none"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              if (messageVisible) {
                setMessageVisible(false);
              }
              setEmail(e.target.value);
            }}
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="self-start bg-primary  py-3 px-6 rounded-md font-bold mb-5"
      >
        Submit
      </button>

      <FormMessage
        visible={messageVisible || (errors !== null && errors?.length !== 0)}
        type={errors?.length ? "error" : "success"}
        message={
          errors?.length
            ? extractErrorMessage(errors)
            : "Link has been sent to the email"
        }
      />
    </>
  );
}
