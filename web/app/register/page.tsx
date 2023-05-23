import AuthInputs from "@/components/AuthInputscomponents";

export default function Register() {
  return (
    <main className="w-1/3 m-auto mt-4">
      <AuthInputs isSignIn={false} />
    </main>
  );
}
