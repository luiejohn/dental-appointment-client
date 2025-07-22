"use client";

import Link from "next/link";
import { useAuth } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "../shared/button";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
  const { user, isLoading } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    qc.setQueryData(["me"], null);
    router.push("/login");
  }

  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Dental Scheduler
      </Link>
      <div className="space-x-4">
        <Link href="/booking">Booking</Link>
        {isLoading ? null : user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
