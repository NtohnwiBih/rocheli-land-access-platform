import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  user?: { name?: string; avatar?: string; email?: string; member_code?: string; plan?: string };
  member?: { plan?: string };
  collapsed?: boolean;
  t: (key: string) => string;
  handleLogout: () => void;
};

export function MemberMenuContent({ user, member, collapsed, t, handleLogout }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  // close on escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-x-3 bottom-4 transition-all ${
        collapsed ? "lg:bottom-3" : ""
      }`}
    >
      {/* Dropdown panel */}
      {open && (
        <div
          className={`absolute z-50 mb-2 w-full min-w-56 rounded-lg border border-white/10 bg-sidebar-accent p-1 text-sm shadow-lg ${
            collapsed ? "bottom-full left-full ml-2 w-56" : "bottom-full left-0"
          }`}
        >
          <div className="flex items-center gap-2 px-2 py-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-sidebar-accent">
                {user?.name?.slice(0, 2).toUpperCase() ?? "M"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="truncate text-sm font-semibold">
                {user?.name ?? t("member.layout.defaultMemberName")}
              </div>
              <div className="truncate text-xs text-white/60">
                {user?.email ?? t("member.layout.defaultMemberEmail")}
              </div>
            </div>
          </div>

          <div className="my-1 h-px bg-white/10" />

          <a
            href="/member/settings"
            className="flex w-full items-center rounded-md px-2 py-1.5 text-left hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t("member.layout.settings")}
          </a>

          <div className="my-1 h-px bg-white/10" />

          <button
            onClick={() => {
              setOpen(false);
              handleLogout();
            }}
            data-test="logout-button"
            className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-red-400 hover:bg-white/10"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {t("member.layout.logout")}
          </button>
        </div>
      )}

      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 rounded-2xl text-left transition-all p-2 ${
          open ? "bg-sidebar-accent/50" : ""
        } ${collapsed ? "lg:justify-center lg:p-2" : ""}`}
      >
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="text-sidebar-accent">
            {user?.name?.slice(0, 2).toUpperCase() ?? "M"}
          </AvatarFallback>
        </Avatar>
        <div
          className={`min-w-0 flex-1 overflow-hidden transition-all ${
            collapsed ? "lg:w-0 lg:opacity-0" : "lg:w-auto lg:opacity-100"
          }`}
        >
          <div className="truncate text-sm font-semibold">
            {user?.name ?? t("member.layout.defaultMemberName")}
          </div>
        </div>
        <ChevronsUpDown
          className={`ml-auto size-4 shrink-0 text-white/70 transition-all ${
            collapsed ? "lg:hidden" : ""
          }`}
        />
      </button>
    </div>
  );
}