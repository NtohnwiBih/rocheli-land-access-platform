import { Footer } from "@/layouts/site/site-footer";
import { Nav } from "@/layouts/site/site-navbar";
import type { SiteLayoutProps } from "@/types";
import { usePage } from "@inertiajs/react";

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { footer } = usePage<{ footer?: Record<string, any> }>().props;
   
  return (
    <>
      <Nav />
       <main className="overflow-x-hidden pt-20">{children}</main>
      <Footer content={footer} />
    </>
  );
}