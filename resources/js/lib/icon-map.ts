import {
  ShieldCheck,
  CalendarClock,
  FileLock,
  Headset,
  TrendingUp,
  Building2,
  Wallet,
  FileText,
  HeartHandshake,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  CalendarClock,
  FileLock,
  Headset,
  TrendingUp,
  Building2,
  Wallet,
  FileText,
  HeartHandshake,
  KeyRound,
};

export function resolveIcon(name: string): LucideIcon {
  return iconMap[name] ?? ShieldCheck;
}