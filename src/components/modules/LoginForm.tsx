/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { setAuthCookies } from "@/helpers/authCookies";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FieldValues>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: FieldValues) => {
    console.log("Login Submitted: ", values);
    setIsLoading(true);

    try {
      // First, call your backend directly to get tokens
      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );

      const backendData = await backendResponse.json();
      console.log("Backend login response:", backendData);

      if (!backendResponse.ok || !backendData.success) {
        throw new Error(backendData.message || "Login failed");
      }

      // Store the tokens in cookies
      if (backendData.tokens) {
        setAuthCookies(
          backendData.tokens.accessToken,
          backendData.tokens.refreshToken
        );
        console.log("✅ Tokens stored in cookies");
      }

      // Now sign in with NextAuth to create session
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      console.log("NextAuth signIn result:", result);

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.url) {
        toast.success("Login successful!");
        router.push(result.url);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
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
            disabled={isLoading}
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
          Don&apos;t have an account? Sorry only the owner can login. You
          can&apos;t access this unless you are the owner.
        </p>
      </div>
    </div>
  );
}
