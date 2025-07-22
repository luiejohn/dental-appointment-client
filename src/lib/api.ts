import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function fetcher<T>(url: string, opts: RequestInit = {}): Promise<T> {
  const full = `${BASE_URL}${url}`;

  const headers = new Headers(opts.headers);
  headers.set("Content-Type", "application/json");

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const res = await fetch(full, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface LoginResponse {
  token: string;
}

export interface Dentist {
  id: string;
  name: string;
  specialization: string;
  profilePhotoUrl?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  dentistId: string;
  startTs: string;
  endTs: string;
  status: string;
}

export function useRegister() {
  return useMutation<UserProfile, Error, RegisterInput>({
    mutationFn: (data) =>
      fetcher<UserProfile>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation<LoginResponse, Error, LoginInput>({
    mutationFn: (data) =>
      fetcher<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });
}

export function useMe() {
  return useQuery<UserProfile, Error>({
    queryKey: ["me"],
    queryFn: () => fetcher<UserProfile>("/auth/me"),
  });
}

export function useDentists() {
  return useQuery<Dentist[], Error>({
    queryKey: ["dentists"],
    queryFn: () => fetcher<Dentist[]>("/dentists"),
  });
}

export function useCreateDentist() {
  const qc = useQueryClient();
  return useMutation<Dentist, Error, Omit<Dentist, "id">>({
    mutationFn: (data) =>
      fetcher<Dentist>("/dentists", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dentists"] }),
  });
}

export function useAppointments() {
  return useQuery<Appointment[], Error>({
    queryKey: ["appointments"],
    queryFn: () => fetcher<Appointment[]>("/appointments"),
  });
}

export function useBookAppointment() {
  const qc = useQueryClient();
  return useMutation<Appointment, Error, Omit<Appointment, "id" | "userId">>({
    mutationFn: (data) =>
      fetcher<Appointment>("/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useRescheduleAppointment() {
  const qc = useQueryClient();
  return useMutation<
    Appointment,
    Error,
    { id: string; startTs: string; endTs: string }
  >({
    mutationFn: ({ id, startTs, endTs }) =>
      fetcher<Appointment>(`/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ startTs, endTs }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      fetcher<void>(`/appointments/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}
