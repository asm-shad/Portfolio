"use client";

import React from "react";
import { useForm, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginForm() {
  const form = useForm<FieldValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FieldValues) => {
    try {
      const res = await signIn("credentials", {
        ...values,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (res?.ok) {
        toast.success("Login successful!");
      } else {
        toast.error("Invalid credentials");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md bg-background p-8 rounded-xl shadow-md border">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social login buttons */}
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <Image
              src="https://img.icons8.com/color/24/google-logo.png"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don’t have an account? Sorry only the owner can login. You can&apos;t
          access this unless you are the owner.
        </p>
      </div>
    </div>
  );
}
