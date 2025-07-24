"use client";

import { useForm } from "react-hook-form";
import { useLogin, fetcher, UserProfile } from "../../lib/api";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../../components/shared/button";
import { Input } from "../../components/shared/input";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const mutation = useLogin();
  const router = useRouter();
  const qc = useQueryClient();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await mutation.mutateAsync(data);
      localStorage.setItem("token", res.token);

      const me = await fetcher<UserProfile>("/auth/me");
      qc.setQueryData(["me"], me);

      router.push("/dashboard");
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const isLoading = mutation.status === "pending";
  const isError = mutation.status === "error";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 space-y-4"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      <Input
        type="email"
        placeholder="Email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <p className="text-red-600">{errors.email.message}</p>}

      <Input
        type="password"
        placeholder="Password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && (
        <p className="text-red-600">{errors.password.message}</p>
      )}

      {isError && <p className="text-red-600">Incorrect email or password</p>}

      <div className="flex justify-between items-center pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/register")}
        >
          Register
        </Button>
      </div>
    </form>
  );
}
