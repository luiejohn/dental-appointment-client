"use client";
import { useForm } from "react-hook-form";
import { useRegister } from "../../lib/api";
import { useRouter } from "next/navigation";
import { Button } from "../../components/shared/button";
import { Input } from "../../components/shared/input";

type RegisterForm = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();
  const mutation = useRegister();
  const router = useRouter();

  async function onSubmit(data: RegisterForm) {
    try {
      await mutation.mutateAsync(data);
      router.push("/login");
    } catch (err: unknown) {
      console.error(err);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-4 space-y-4"
    >
      <h1 className="text-2xl font-bold">Register</h1>
      <Input
        type="email"
        placeholder="Email"
        {...register("email", { required: true })}
      />
      {errors.email && <p className="text-red-600">Email is required</p>}
      <Input
        type="password"
        placeholder="Password"
        {...register("password", { required: true, minLength: 6 })}
      />
      {errors.password && (
        <p className="text-red-600">Password must be at least 6 characters</p>
      )}
      <Input
        placeholder="Full Name"
        {...register("name", { required: true })}
      />
      {errors.name && <p className="text-red-600">Name is required</p>}
      <Input type="tel" placeholder="Phone (optional)" {...register("phone")} />
      +{" "}
      <Button type="submit" disabled={mutation.status === "pending"}>
        + {mutation.status === "pending" ? "Registering..." : "Register"}+{" "}
      </Button>
    </form>
  );
}
