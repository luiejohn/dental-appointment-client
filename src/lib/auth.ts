"use client";

import { useMe } from "./api";
import type { UserProfile } from "./api";

export function useAuth(): { user: UserProfile | null; isLoading: boolean } {
  const { data, isLoading } = useMe();
  return { user: data ?? null, isLoading };
}
