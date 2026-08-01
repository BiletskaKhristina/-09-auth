"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { logout, getMe } from "@/lib/api/clientApi";
import type { User } from "@/types/user";


export default function AuthNavigation() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };


    fetchUser();

  }, []);



  const handleLogout = async () => {
    try {
      await logout();

      setUser(null);

      router.push("/sign-in");
      router.refresh();

    } catch (error) {
      console.error("Logout failed", error);
    }
  };



  if (loading) {
    return null;
  }



  return (
    <>
      {user ? (
        <>
          <li>
            {user.email}
          </li>

          <li>
            <Link href="/profile">
              Profile
            </Link>
          </li>

          <li>
            <Link href="/notes">
              Notes
            </Link>
          </li>

          <li>
            <button
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href="/sign-in">
              Sign In
            </Link>
          </li>

          <li>
            <Link href="/sign-up">
              Sign Up
            </Link>
          </li>
        </>
      )}
    </>
  );
}