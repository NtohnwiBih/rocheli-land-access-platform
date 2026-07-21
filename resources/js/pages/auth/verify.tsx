import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AuthSplitLayout from "@/layouts/auth/auth-split-layout";
import { Mail } from "lucide-react";

type Props = {
  status?: string;
};

export default function VerifyEmail({ status }: Props) {
  const { post, processing } = useForm({});

  const resend = () => {
    post("/email/verification-notification");
  };

  return (
    <>
      <Head title="Verify your email" />
      <AuthSplitLayout title="" description="">
        <Badge variant="secondary" className="mb-4">Almost there</Badge>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rocheli-blue/10 text-rocheli-blue">
          <Mail className="h-7 w-7" />
        </div>

        <h1 className="mt-4 font-display text-3xl font-black md:text-4xl">Check your inbox</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We've sent a verification link to your email. Click it to finish confirming your account.
        </p>

        {status === "verification-link-sent" && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            A new verification link has been sent.
          </p>
        )}

        <Button onClick={resend} variant="brand" className="mt-6 w-full" disabled={processing}>
          {processing ? "Sending…" : "Resend verification email"}
        </Button>
      </AuthSplitLayout>
    </>
  );
}