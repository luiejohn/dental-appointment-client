"use client";
import { useForm } from "react-hook-form";
import { useLogin } from "../../lib/api";
import { useRouter } from "next/navigation";
import { Button } from "../../components/shared/button";
import { Input } from "../../components/shared/input";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const mutation = useLogin();
  const router = useRouter();

  async function onSubmit(data: LoginForm) {
    try {
      const res = await mutation.mutateAsync(data);
      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 space-y-4"
    >
      <h1 className="text-2xl font-bold">Login</h1>

      <Input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && <p className="text-red-600">Email is required</p>}

      <Input
        type="password"
        placeholder="Password"
        {...register("password", { required: true })}
      />
      {errors.password && <p className="text-red-600">Password is required</p>}

      <Button type="submit" disabled={mutation.status === "pending"}>
        {mutation.status === "pending" ? "Logging in..." : "Login"}
      </Button>
    </form>
  );
}
