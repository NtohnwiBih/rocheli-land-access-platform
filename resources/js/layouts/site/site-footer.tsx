import { Link } from "@inertiajs/react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

type FooterContent = {
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
};

interface Props {
  content?: FooterContent;
}

export function Footer({ content = {} }: Props) {
  const socials = [
    { Icon: Facebook, href: content.facebookUrl },
    { Icon: Instagram, href: content.instagramUrl },
    { Icon: Linkedin, href: content.linkedinUrl },
    { Icon: Twitter, href: content.twitterUrl },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-navy text-white/85 mt-24">
      <div
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 opacity-40"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(255,210,26,0.25), transparent 70%)",
        }}
      />
      <div className="container-x pt-20 pb-10 relative">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="group flex items-center gap-2.5 shrink-0">
              <img src="/logo1.png" alt="Rocheli Real Properties" className="h-18 w-auto" />
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              {content.description ??
                "A technology-driven real estate company helping thousands of Cameroonians secure verified land and build multi-generational wealth through the Land Access Club."}
            </p>

            <form className="glass rounded-2xl p-2 flex items-center gap-2 max-w-md">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none min-w-0"
              />
              <button
                type="button"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-gradient-gold px-4 py-2 text-xs font-semibold text-navy"
              >
                Subscribe <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="flex gap-2">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href || "#"}
                  target={href ? "_blank" : undefined}
                  rel={href ? "noopener noreferrer" : undefined}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/70 hover:border-gold/60 hover:text-gold transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white mb-5">
              Explore
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ["Properties", "/properties"],
                ["Land Access Club", "/land-access-club"],
                ["Services", "/services"],
                ["About", "/about"],
                ["Resources", "/resources"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-white/60 hover:text-gold transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white mb-5">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {["Leadership", "Careers", "Press", "Partners", "Legal"].map((label) => (
                <li key={label}>
                  <a href="#" className="text-white/60 hover:text-gold transition">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-widest text-white mb-5">
              Reach us
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-white/60">
                  {content.address ?? "Bonapriso HQ, Douala, Cameroon"}
                </span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-white/60">{content.phone ?? "+237 6 55 00 00 00"}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-white/60">{content.email ?? "hello@rocheli.cm"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Rocheli Real Properties. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}