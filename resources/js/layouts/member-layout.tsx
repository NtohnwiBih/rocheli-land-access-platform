import { Link, usePage, router } from "@inertiajs/react";
import { type PropsWithChildren, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Wallet,
  Landmark,
  FileText,
  Bell,
  User,
  LifeBuoy,
  Map,
  Calculator,
  Users,
  LogOut,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  PanelLeft,
  PanelLeftClose,
  Globe,
} from "lucide-react";
import AppLogoIcon from "@/components/app-logo-icon";

interface NotificationItem {
  id: string | number;
  title: string;
  body: string;
  tone: "success" | "info" | "gold";
  read_at: string | null;
  created_at: string;
}

interface PageProps {
  auth: {
    user: {
      name: string;
      email: string;
      member_code?: string;
      plan?: string;
      avatar?: string;
    };
  };
  member?: {
    goal: string;
    preferred_locations: string[];
    land_type: string;
    plan: string;
    contribution_frequency: string;
    contribution_amount: string;
    payment_method: string;
    status: "pending" | "under_review" | "approved" | "rejected";
    submitted_at: string;
  };
  notifications?: NotificationItem[];
  [key: string]: unknown;
}

const nav = [
  { href: "/member", key: "overview", icon: LayoutDashboard },
  { href: "/member/contributions", key: "contributions", icon: Wallet },
  { href: "/member/property", key: "property", icon: Landmark },
  { href: "/member/documents", key: "documents", icon: FileText },
  { href: "/member/notifications", key: "notifications", icon: Bell },
  { href: "/member/map", key: "map", icon: Map },
  { href: "/member/calculator", key: "calculator", icon: Calculator },
  { href: "/member/referrals", key: "referrals", icon: Users },
  { href: "/member/profile", key: "profile", icon: User },
  { href: "/member/support", key: "support", icon: LifeBuoy },
] as const satisfies readonly { href: string; key: string; icon: typeof LayoutDashboard }[];

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem("theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function MemberLayout({ children }: PropsWithChildren) {
  const { url, props } = usePage<PageProps>();
  const { t, i18n } = useTranslation();
  const user = props.auth?.user;
  const member = props.member;
  const notifications = props.notifications ?? [];
  const unreadCount = notifications.filter((n) => !n.read_at).length;
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  function toggleLanguage() {
    const next = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(next);
    window.localStorage.setItem("lang", next);
  }

  const sidebarWidth = collapsed ? "lg:w-20" : "lg:w-72";
  const mainOffset = collapsed ? "lg:pl-20" : "lg:pl-72";

  function handleLogout() {
    router.post("/logout");
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${sidebarWidth}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link href="/" className={`overflow-hidden transition-all ${collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}>
            <AppLogoIcon />
          </Link>
          <button
            className={`hidden lg:grid h-8 w-8 place-items-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white transition-colors ${collapsed ? "lg:mx-auto" : ""}`}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? t("member.layout.expandSidebar") : t("member.layout.collapseSidebar")}
            title={collapsed ? t("member.layout.expandSidebar") : t("member.layout.collapseSidebar")}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label={t("member.layout.close")}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {nav.map((n) => {
            const active = url === n.href || (n.href !== "/member" && url.startsWith(n.href));
            const label = t(`member.layout.nav.${n.key}`);
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                title={collapsed ? label : undefined}
                className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  collapsed ? "lg:justify-center lg:px-2" : "gap-3"
                } ${
                  active
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white"
                }`}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                <span className={`overflow-hidden transition-all ${collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}>
                  {label}
                </span>
                {active && <span className={`ml-auto h-1.5 w-1.5 rounded-full bg-rocheli-gold ${collapsed ? "lg:hidden" : ""}`} />}
              </Link>
            );
          })}
        </nav>

        <div className={`absolute inset-x-3 bottom-4 rounded-2xl bg-sidebar-accent/60 p-4 transition-all ${collapsed ? "lg:p-2 lg:bottom-3" : ""}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "lg:justify-center" : ""}`}>
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() ?? "M"}</AvatarFallback>
            </Avatar>
            <div className={`min-w-0 overflow-hidden transition-all ${collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}>
              <div className="truncate text-sm font-semibold">{user?.name ?? t("member.layout.defaultMemberName")}</div>
              <div className="truncate text-xs text-white/60">
                {user?.member_code ?? t("member.layout.defaultMemberCode")} · {user?.plan ?? member?.plan ?? t("member.dashboard.noPlanSelected")}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`ml-auto text-white/70 hover:text-white ${collapsed ? "lg:hidden" : ""}`}
              aria-label={t("member.layout.logout")}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className={`transition-all duration-300 ${mainOffset}`}>
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden max-w-md flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("member.layout.search")} className="h-10 border-0 bg-muted pl-10" />
            </div>
            <div className="ml-auto flex items-center lg:gap-3 gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                aria-label={t("member.layout.toggleLanguage")}
                title={i18n.language === "en" ? t("member.layout.switchToFrench") : t("member.layout.switchToEnglish")}
              >
                <span className="flex items-center gap-1 text-xs font-bold">
                  <Globe className="h-4 w-4" />
                  {i18n.language.toUpperCase()}
                </span>
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} aria-label={t("member.layout.toggleTheme")}>
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rocheli-gold opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rocheli-gold" />
                        </span>
                    )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold">
                    {t("member.layout.notificationsDropdown.title")}
                    {unreadCount > 0 && (
                        <Badge variant="secondary" className="text-[10px]">{unreadCount}</Badge>
                    )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {notifications.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                        {t("member.layout.notificationsDropdown.empty")}
                    </div>
                    ) : (
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.slice(0, 5).map((n) => (
                        <DropdownMenuItem key={n.id} className="flex items-start gap-3 whitespace-normal py-2.5">
                            <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                n.tone === "success" ? "bg-emerald-500" : n.tone === "gold" ? "bg-rocheli-gold" : "bg-rocheli-blue"
                            }`}
                            />
                            <div className="min-w-0 flex-1">
                            <div className={`text-sm ${n.read_at ? "text-muted-foreground" : "font-semibold"}`}>{n.title}</div>
                            <div className="truncate text-xs text-muted-foreground">{n.body}</div>
                            </div>
                        </DropdownMenuItem>
                        ))}
                    </div>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                    <Link href="/member/notifications" className="w-full justify-center text-sm font-medium text-rocheli-blue">
                        {t("member.layout.notificationsDropdown.viewAll")}
                    </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Badge className="hidden bg-rocheli-blue/10 text-rocheli-blue sm:inline-flex">
                {user?.plan ?? member?.plan ?? t("member.dashboard.noPlanSelected")} {user?.plan ? t("member.dashboard.planSuffix") : ""}
              </Badge>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() ?? "M"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}