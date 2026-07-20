import { Link, usePage, router } from "@inertiajs/react";
import { type PropsWithChildren, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Building2,
  Newspaper,
  Users,
  Mail,
  Wallet,
  Settings,
  ArrowLeft,
  Bell,
  Search,
  Menu,
  X,
  Moon,
  Sun,
  PanelLeft,
  PanelLeftClose,
  ChevronsUpDown,
  Globe,
  Check,
  ChevronsDown,
  ChevronDown,
  Quote,
  HelpCircle,
  Tag,
  ScrollText,
} from "lucide-react";
import AppLogoIcon from "@/components/app-logo-icon";
import { AdminMenuContent } from "@/components/admin/AdminMenuContent";
import { pageSchemas } from "@/components/admin/content-schemas";

interface ContactMessage {
  id: string | number;
  name: string;
  interest?: string;
  message: string;
  handled: boolean;
  created_at: string;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  tone: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
}

interface PageProps {
  auth: {
    user: {
      name: string;
      email: string;
      avatar?: string;
      role?: string;
    };
  };
  notifications?: NotificationItem[];
  contacts?: ContactMessage[];
  [key: string]: unknown;
}

type Lang = "en" | "fr";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem("theme");
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem("rocheli:admin-lang");
  return stored === "fr" ? "fr" : "en";
}

export function AdminLayout({ children }: PropsWithChildren) {
  const { url, props } = usePage<PageProps>();
  const { t, i18n } = useTranslation();
  const user = props.auth?.user;
  const contacts = props.contacts ?? [];
  const notifications = props.notifications ?? [];
  const unread = notifications.filter((n) => !n.read_at).length;

  const markRead = (id: string) => {
    router.post(`/rocheli/notifications/${id}/read`, {}, { preserveScroll: true, preserveState: true });
  };

  const nav = [
    { href: "/rocheli", key: "dashboard", label: t("admin.adminNav.dashboard"), icon: LayoutDashboard, exact: true },
    {
      key: "content",
      label: t("admin.adminNav.content"),
      icon: Settings,
      exact: false,
      children: pageSchemas.map((p) => ({
        href: `/rocheli/content/${p.key}`,
        key: `content-${p.key}`,
        label: p.label,
      })),
    },
    { href: "/rocheli/categories", key: "categories", label: t("admin.adminNav.categories"), icon: Tag, exact: false },
    { href: "/rocheli/properties", key: "properties", label: t("admin.adminNav.properties"), icon: Building2, exact: false },
    { href: "/rocheli/articles", key: "articles", label: t("admin.adminNav.articles"), icon: Newspaper, exact: false },
    { href: "/rocheli/testimonials", key: "testimonials", label: t("admin.adminNav.testimonials"), icon: Quote, exact: false },
    { href: "/rocheli/faqs", key: "faqs", label: t("admin.adminNav.faqs"), icon: HelpCircle, exact: false },
    { href: "/rocheli/plans", key: "plans", label: t("admin.adminNav.plans"), icon: Wallet, exact: false },
    { href: "/rocheli/members", key: "members", label: t("admin.adminNav.members"), icon: Users, exact: false },
    { href: "/rocheli/legal", key: "legal", label: t("admin.adminNav.legal"), icon: ScrollText, exact: false },
    { href: "/rocheli/contacts", key: "contacts", label: t("admin.adminNav.contacts"), icon: Mail, exact: false },
  ] as const;

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState<boolean>(getInitialDark);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [openGroup, setOpenGroup] = useState<string | null>(() => {
  const match = nav.find((n) => "children" in n && n.children.some((c) => url.startsWith(c.href)));
    return match?.key ?? null;
  });

  const [lang, setLang] = useState<Lang>(getInitialLang);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    window.localStorage.setItem("rocheli:admin-lang", lang);
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // close custom user menu on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [userMenuOpen]);

  // close language menu on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    if (langMenuOpen) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [langMenuOpen]);

  const sidebarWidth = collapsed ? "lg:w-20" : "lg:w-72";
  const mainOffset = collapsed ? "lg:pl-20" : "lg:pl-72";

  const active = nav.find((n) => "href" in n && (n.exact ? url === n.href : url.startsWith(n.href)));

  function handleLogout() {
    router.post(
      "/logout",
      {},
      {
        onSuccess: () => router.visit("/rocheli/login"),
      },
    );
  }

  function handleReset() {
      if (confirm(t("admin.adminLayout.resetConfirm"))) {
        router.post("/rocheli/reset", {}, { preserveScroll: true });
      }
  }

  function NotificationDot({ tone, read }: { tone: string; read: boolean }) {
    return (
      <span
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          read
            ? "bg-muted-foreground/30"
            : tone === "success"
            ? "bg-emerald-500"
            : tone === "gold"
            ? "bg-rocheli-gold"
            : "bg-rocheli-blue"
        }`}
      />
    );
  }

  function NotificationBody({ n }: { n: NotificationItem }) {
    return (
      <div className="min-w-0 flex-1">
        <div className={`text-sm ${n.read_at ? "text-muted-foreground" : "font-semibold"}`}>{n.title}</div>
        <div className="truncate text-xs text-muted-foreground">{n.body}</div>
        <div className="mt-0.5 text-[10px] text-muted-foreground/70">{n.created_at}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        } ${sidebarWidth}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Link
            href="/"
            className={`overflow-hidden transition-all ${collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}
          >
            <AppLogoIcon />
          </Link>
          <button
            className={`hidden lg:grid h-8 w-8 place-items-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white transition-colors ${collapsed ? "lg:mx-auto" : ""}`}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? t("admin.adminLayout.expandSidebar") : t("admin.adminLayout.collapseSidebar")}
            title={collapsed ? t("admin.adminLayout.expandSidebar") : t("admin.adminLayout.collapseSidebar")}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <button className="lg:hidden" onClick={() => setMobileNavOpen(false)} aria-label={t("admin.adminLayout.close")}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pt-6 pb-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold">Workspace</div>
        </div>

        <nav className="flex flex-col gap-1 p-3">
            {nav.map((n) => {
                if ("children" in n) {
                const isGroupActive = n.children.some((c) => url.startsWith(c.href));
                const isOpen = openGroup === n.key;

                return (
                    <div key={n.key}>
                    <button
                        type="button"
                        onClick={() => {
                        if (collapsed) {
                            // collapsed sidebar: just navigate to first child instead of expanding
                            router.visit(n.children[0].href);
                            return;
                        }
                        setOpenGroup((g) => (g === n.key ? null : n.key));
                        }}
                        title={collapsed ? n.label : undefined}
                        className={`flex w-full items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                        collapsed ? "lg:justify-center lg:px-2" : "gap-3"
                        } ${
                        isGroupActive
                            ? "bg-sidebar-accent text-white"
                            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white"
                        }`}
                    >
                        <n.icon className={`h-4 w-4 shrink-0 ${
                          isGroupActive
                          ? "text-rocheli-gold"
                          : "text-sidebar-foreground/75"
                        }`} />
                        <span
                        className={`flex-1 overflow-hidden text-left transition-all ${
                            collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"
                        }`}
                        >
                        {n.label}
                        </span>
                        {!collapsed && (
                        <ChevronDown
                            className={`h-3.5 w-3.5 shrink-0 text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                        )}
                    </button>

                    {!collapsed && isOpen && (
                        <div className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                        {n.children.map((c) => {
                            const isActive = url.startsWith(c.href);
                            return (
                            <Link
                                key={c.href}
                                href={c.href}
                                onClick={() => setMobileNavOpen(false)}
                                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                                isActive
                                    ? "bg-sidebar-accent/80 text-white font-medium"
                                    : "text-sidebar-foreground/65 hover:bg-sidebar-accent/40 hover:text-white"
                                }`}
                            >
                                {c.label}
                            </Link>
                            );
                        })}
                        </div>
                    )}
                    </div>
                );
                }

                const isActive = n.exact ? url === n.href : url.startsWith(n.href);
                const badge = n.key === "contacts" && unread > 0 ? unread : null;
                return (
                <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setMobileNavOpen(false)}
                    title={collapsed ? n.label : undefined}
                    className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    collapsed ? "lg:justify-center lg:px-2" : "gap-3"
                    } ${
                    isActive
                        ? "bg-sidebar-accent text-white"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-white"
                    }`}
                >
                    <n.icon className={`h-4 w-4 shrink-0 ${
                      isActive
                      ? "text-rocheli-gold"
                      : "text-sidebar-foreground/75"
                    }`} />
                    <span
                    className={`flex-1 overflow-hidden transition-all ${collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}
                    >
                    {n.label}
                    </span>
                    {badge && (
                    <span
                        className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rocheli-gold text-navy ${collapsed ? "lg:hidden" : ""}`}
                    >
                        {badge}
                    </span>
                    )}
                    {isActive && <span className={`ml-auto h-1.5 w-1.5 rounded-full bg-rocheli-gold ${collapsed ? "lg:hidden" : ""}`} />}
                </Link>
                );
            })}
        </nav>

        <div className="px-3 mt-4">
          <Link
            href="/"
            className={`flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-white transition-colors ${
              collapsed ? "lg:justify-center lg:px-2" : "gap-3"
            }`}
            title={collapsed ? t("admin.adminLayout.backToSite") : undefined}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span
              className={`overflow-hidden transition-all ${collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"}`}
            >
              {t("admin.adminLayout.backToSite")}
            </span>
          </Link>
        </div>

        {/* Custom user menu (no shadcn dropdown, matches earlier MemberMenu pattern) */}
        <div
          ref={userMenuRef}
          className={`absolute inset-x-3 bottom-4 transition-all ${collapsed ? "lg:bottom-3" : ""}`}
        >
          {userMenuOpen && (
            <div
              className={`absolute z-50 mb-2 w-full min-w-56 rounded-lg border border-white/10 bg-sidebar-accent p-1 shadow-lg ${
                collapsed ? "bottom-full left-full ml-2 w-56" : "bottom-full left-0"
              }`}
            >
              <AdminMenuContent
                user={user}
                collapsed={collapsed}
                handleLogout={handleLogout}
                handleReset={handleReset}
              />
            </div>
          )}

          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className={`flex w-full items-center gap-3 rounded-2xl bg-sidebar-accent/60 p-4 text-left transition-all hover:bg-sidebar-accent/80 ${
              userMenuOpen ? "bg-sidebar-accent" : ""
            } ${collapsed ? "lg:justify-center lg:p-2" : ""}`}
          >
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() ?? "AD"}</AvatarFallback>
            </Avatar>
            <div
              className={`min-w-0 flex-1 overflow-hidden transition-all ${
                collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"
              }`}
            >
              <div className="truncate text-sm font-semibold">{user?.name ?? t("admin.adminLayout.adminFallback")}</div>
              <div className="truncate text-xs text-white/60">{user?.role ?? t("admin.adminLayout.administrator")}</div>
            </div>
            <ChevronsUpDown
              className={`ml-auto size-4 shrink-0 text-white/70 transition-all ${collapsed ? "lg:hidden" : ""}`}
            />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`transition-all duration-300 ${mainOffset}`}>
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-lg">
          <div className="flex h-16 items-center gap-3 px-4 md:px-6">
            <button className="lg:hidden" onClick={() => setMobileNavOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="text-muted-foreground">{t("admin.adminLayout.brandName")}</span>
              <span className="text-muted-foreground/40">/</span>
              <span className="font-medium">{active?.label ?? t("admin.adminLayout.adminFallback")}</span>
            </div>

            <div className="relative ml-auto hidden max-w-xs flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder={t("admin.adminLayout.searchPlaceholder")} className="h-10 border-0 bg-muted pl-10" />
            </div>

            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-full border border-border bg-white hover:bg-muted transition text-xs font-semibold"
                aria-label={t("admin.adminLayout.changeLanguage")}
              >
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="uppercase">{lang}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-border bg-white shadow-elegant overflow-hidden z-30">
                  {(["en", "fr"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setLangMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm hover:bg-muted transition"
                    >
                      <span>{l === "en" ? t("admin.adminLayout.english") : t("admin.adminLayout.french")}</span>
                      {lang === l && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2 sm:ml-0">
              <div className="mr-1 hidden items-center gap-2 text-xs md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-muted-foreground">{t("admin.adminLayout.livePreview")}</span>
              </div>

              <Button variant="ghost" size="icon" onClick={() => setDark((d) => !d)} aria-label={t("admin.adminLayout.toggleTheme")}>
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unread > 0 && (
                      <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rocheli-gold opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-rocheli-gold" />
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96">
                  <DropdownMenuLabel className="flex items-center justify-between text-sm font-semibold">
                    {t("admin.adminLayout.notifications")}
                    {unread > 0 && <Badge variant="secondary" className="text-[10px]">{unread}</Badge>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {notifications.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      {t("admin.adminLayout.noNotifications")}
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 8).map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          onClick={() => !n.read_at && markRead(n.id)}
                          asChild={!!n.link}
                          className="flex items-start gap-3 whitespace-normal py-2.5"
                        >
                          {n.link ? (
                            <Link href={n.link} className="flex items-start gap-3">
                              <NotificationDot tone={n.tone} read={!!n.read_at} />
                              <NotificationBody n={n} />
                            </Link>
                          ) : (
                            <div className="flex items-start gap-3">
                              <NotificationDot tone={n.tone} read={!!n.read_at} />
                              <NotificationBody n={n} />
                            </div>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </div>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/rocheli/contacts" className="w-full justify-center text-sm font-medium text-rocheli-blue">
                      {t("admin.adminLayout.viewAllContacts")}
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.slice(0, 2).toUpperCase() ?? "AD"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}