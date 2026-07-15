"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
      role: selectedRole,
    });

    setIsSubmitting(false);

    if (error) {
      setSubmitError(error.message || "Signup failed.");
      return;
    }

    if (data) {
      router.push(
        selectedRole === "admin" ? "/items/manage" : "/explore"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold">
            Create your account
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Join Wayfarer to explore or manage boutique stays.
          </p>
        </div>

        {submitError && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        <Form
          className="flex flex-col gap-5"
          onSubmit={onSubmit}
        >
          <TextField
            isRequired
            name="name"
            validate={(value) =>
              value.length < 3
                ? "Name must be at least 3 characters."
                : null
            }
          >
            <Label>Full Name</Label>

            <Input placeholder="John Doe" />

            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) =>
              /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? null
                : "Enter a valid email."
            }
          >
            <Label>Email</Label>

            <Input placeholder="john@example.com" />

            <FieldError />
          </TextField>

          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8)
                return "Password must be at least 8 characters.";

              if (!/[A-Z]/.test(value))
                return "Must contain one uppercase letter.";

              if (!/\d/.test(value))
                return "Must contain one number.";

              return null;
            }}
          >
            <Label>Password</Label>

            <Input placeholder="********" />

            <Description>
              Minimum 8 characters, one uppercase and one number.
            </Description>

            <FieldError />
          </TextField>

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Account Type
            </p>

            <div className="grid grid-cols-2 gap-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={`rounded-md py-2 text-sm transition ${
                  selectedRole === "user"
                    ? "bg-white text-indigo-600 shadow dark:bg-zinc-700"
                    : ""
                }`}
              >
                Explorer
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`rounded-md py-2 text-sm transition ${
                  selectedRole === "admin"
                    ? "bg-white text-indigo-600 shadow dark:bg-zinc-700"
                    : ""
                }`}
              >
                Boutique Host
              </button>
            </div>
          </div>

          <Button
            type="submit"
            isDisabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>

          <Button
            type="reset"
            variant="outline"
            className="w-full"
          >
            Reset
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-indigo-600"
            >
              Sign In
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}