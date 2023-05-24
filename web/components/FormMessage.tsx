interface Props {
  type: "success" | "error";
  message: string;
  visible: boolean;
}

export default function FormMessage({ message, type, visible }: Props) {
  if (!visible) return null;

  return (
    <div
      className={`${
        type === "error"
          ? "text-red-700 border-red-700"
          : "text-green-700 border-green-700"
      }  font-bold p-2 rounded-md w-full border-2 `}
    >
      {message}
    </div>
  );
}
