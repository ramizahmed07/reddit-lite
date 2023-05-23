"use client";

import Link from "next/link";

import { useMe } from "@/hooks/useMecomponents";
import { useAuth } from "@/hooks/useAuthcomponents";

const NavLinks = () => {
  const { data, isLoading } = useMe();
  const { logout } = useAuth();

  if (isLoading) {
    return null;
  } else if (!data?.me) {
    return (
      <div className="font-bold">
        <Link className="mr-4" href="/login">
          Login
        </Link>
        <Link href="/register">Register</Link>
      </div>
    );
  } else {
    return (
      <div className="font-bold">
        <span className="mr-4 font-light">{data?.me?.username}</span>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }
};

export default NavLinks;
