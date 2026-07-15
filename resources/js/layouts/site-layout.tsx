import { Footer } from "@/layouts/site/site-footer";
import { Nav } from "@/layouts/site/site-navbar";
import type { SiteLayoutProps } from "@/types";

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      <Nav />
       <main className="overflow-x-hidden pt-20">{children}</main>
      <Footer />
    </>
  );
}