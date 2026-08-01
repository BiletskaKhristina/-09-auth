"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/api";
import { useEffect, useState } from "react";
import type { User } from "@/types/user";
import { getMe } from "@/lib/api/api";

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

  // 🚪 logout
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
    return <div>Loading...</div>;
  }

  return (
    <nav>
      {user ? (
        <>
          {}
          <Link href="/profile">Profile</Link>
          {" | "}
          <Link href="/notes">Notes</Link>
          {" | "}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          {}
          <Link href="/sign-in">Sign In</Link>
          {" | "}
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
    </nav>
  );
}