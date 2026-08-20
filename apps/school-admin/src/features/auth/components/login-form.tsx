"use client";

import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  Checkbox,
} from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  loginSchema,
} from "../schemas/login.schema";

import type {
  LoginFormData,
  LoginFormInput,
} from "../schemas/login.schema";

import {
  useLogin,
} from "../hooks/use-login";

export function LoginForm() {
  const [showPassword, setShowPassword] =
    useState(false);

  const login = useLogin();

  const form = useForm<
    LoginFormInput,
    unknown,
    LoginFormData
  >({
    resolver:
      zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const submit = (
    values: LoginFormData,
  ) => {
    login.mutate(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={
          form.handleSubmit(
            submit,
          )
        }
        className="space-y-5"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
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
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    placeholder="Password"
                    className="pr-10"
                    {...field}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value,
                      )
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        className="size-4"
                      />
                    ) : (
                      <Eye
                        className="size-4"
                      />
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
                checked={
                  field.value
                }
                onCheckedChange={(
                  value,
                ) =>
                  field.onChange(
                    Boolean(value),
                  )
                }
              />

              <span className="text-sm text-muted-foreground">
                Remember me
              </span>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            login.isPending
          }
        >
          {login.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />

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