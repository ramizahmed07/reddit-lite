"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useAuth } from "@/hooks/useAuthcomponents";
import { useMe } from "@/hooks/useMecomponents";

const NavLinks = () => {
  const params = useParams();
  const { data, isLoading } = useMe();
  const { logout } = useAuth();

  if (params?.token) return null;
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
