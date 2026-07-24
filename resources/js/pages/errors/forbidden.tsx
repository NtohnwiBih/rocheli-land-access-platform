import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { AuthNavLayout } from '@/layouts/auth/auth-nav-layout';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-muted/40">
      <Head title="Access Denied — Rocheli" />
      <AuthNavLayout />
      <div className="min-h-[100svh] flex flex-col items-center justify-center text-center px-6">
        <span className="font-display text-8xl font-semibold text-gradient-gold">403</span>
        <h1 className="mt-2 font-display text-4xl font-semibold">Access denied</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          You do not have access to this area. If you think this is a mistake, please contact your administrator.
        </p>
        <Button type="button" variant="brand" asChild size="lg" className="mt-8 rounded-full">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}