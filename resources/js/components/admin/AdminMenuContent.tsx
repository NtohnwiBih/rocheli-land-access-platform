import { Link } from "@inertiajs/react";
import { LogOut, Settings, RotateCcw } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AdminUser = {
  name?: string;
  email?: string;
  avatar?: string;
  role?: string;
};

type Props = {
  user?: AdminUser;
  collapsed?: boolean;
  handleLogout: () => void;
  handleReset: () => void;
};

export function AdminMenuContent({ user, handleLogout, handleReset }: Props) {
  return (
    <>
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase() ?? "AD"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="truncate text-sm font-semibold">
            {user?.name ?? "Admin"}
          </div>
          <div className="truncate text-xs text-white/60">
            {user?.email ?? user?.role ?? "Administrator"}
          </div>
        </div>
      </div>

      <div className="my-1 h-px bg-white/10" />

      <Link
        href="/admin/settings"
        className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/10"
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </Link>

      <button
        onClick={handleReset}
        className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/10"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset all data
      </button>

      <div className="my-1 h-px bg-white/10" />

      <button
        onClick={handleLogout}
        data-test="admin-logout-button"
        className="flex w-full items-center rounded-md px-2 py-1.5 text-left text-red-400 hover:bg-white/10"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </button>
    </>
  );
}