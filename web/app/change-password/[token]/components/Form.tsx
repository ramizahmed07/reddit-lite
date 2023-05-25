"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuthcomponents";
import { extractErrorMessage } from "@/utils/extractErrorMessagecomponents";
import FormMessage from "@/components/FormMessagecomponents";

export function Form() {
  const { changePassword, errors } = useAuth();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async () => {
    await changePassword({ newPassword, token });
  };

  return (
    <>
      <div className="field w-full mb-5">
        <label>
          <p className="font-bold pb-2">New Password</p>
          <input
            className="w-full p-3 font-light bg-primary  rounded-md outline-none"
            type="password"
            name="newPassword"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="self-start bg-primary  py-3 px-6 rounded-md font-bold mb-5"
      >
        Change Password
      </button>
      <FormMessage
        visible={errors !== null && errors?.length !== 0}
        type={"error"}
        message={extractErrorMessage(errors!)}
      />
    </>
  );
}
