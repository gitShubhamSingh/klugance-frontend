"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";

import {
  loginSchema,
  LoginFormInput,
  LoginFormData,
} from "../schemas/login.schema";

import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const login = useLogin();

  const form = useForm<LoginFormInput, unknown, LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const submit = (values: LoginFormData) => {
    login.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Email address"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...field}
                  />

                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() =>
                      setShowPassword((v) => !v)
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <Checkbox
                checked={field.value}
                onCheckedChange={(v) =>
                  field.onChange(Boolean(v))
                }
              />

              <span className="text-sm">
                Remember me
              </span>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={login.isPending}
        >
          {login.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}