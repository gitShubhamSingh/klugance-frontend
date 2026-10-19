
import { ResetPasswordPage } from "@/features/auth/pages/reset-password-page";

type Props = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return <ResetPasswordPage token={token} />;
}
