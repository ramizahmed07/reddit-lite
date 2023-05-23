import AuthInputs from "@/components/AuthInputscomponents";

export default function Login() {
  return (
    <main className="w-1/3 m-auto mt-4">
      <AuthInputs isSignIn={true} />
    </main>
  );
}
