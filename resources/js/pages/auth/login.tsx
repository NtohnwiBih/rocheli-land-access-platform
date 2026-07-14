import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import AuthSplitLayout from '@/layouts/auth/auth-split-layout';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [mode, setMode] = useState<"email" | "phone">("email");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in" />
            <AuthSplitLayout>

        <div className="flex flex-col justify-between">
        <Link href="/"></Link>
        <div className="mx-auto w-full max-w-md py-10">
          <Badge variant="secondary" className="mb-4">Member Portal</Badge>
          <h1 className="font-display text-3xl font-black md:text-4xl">Welcome back.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Log in to your Land Access Club account.</p>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1 text-sm">
            <button onClick={() => setMode("email")} className={`rounded-lg px-3 py-2 font-medium transition-colors ${mode === "email" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              <Mail className="mr-1 inline h-4 w-4" /> Email
            </button>
            <button onClick={() => setMode("phone")} className={`rounded-lg px-3 py-2 font-medium transition-colors ${mode === "phone" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
              <Phone className="mr-1 inline h-4 w-4" /> Phone
            </button>
          </div>

          <form className="mt-6 space-y-4">
            <div>
              <Label>{mode === "email" ? "Email" : "Phone number"}</Label>
              <Input className="mt-1.5" placeholder={mode === "email" ? "you@example.com" : "+234 913 000 0000"} />
            </div>
            <div>
                <div className="flex items-center justify-between">
                    <Label>Password</Label>
                    <a href="#" className="text-xs font-medium text-rocheli-blue hover:underline">Forgot?</a>
                </div>
                <div className="relative mt-1.5">
                    <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked /> Remember me
            </label>
            <Button variant="brand" size="lg" className="w-full">Log in</Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            New here? <Link href="/register" className="font-semibold text-rocheli-blue">Create an account</Link>
          </div>
        </div>
      </div>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            </AuthSplitLayout>
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
