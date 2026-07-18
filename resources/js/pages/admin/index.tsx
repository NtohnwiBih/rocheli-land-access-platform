import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Building2, Newspaper, Users, Mail, Wallet, ArrowUpRight, TrendingUp } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';

type Property = {
  id: number | string;
  status: string;
};

type Article = {
  id: number | string;
};

type Plan = {
  id: number | string;
  highlight: boolean;
};

type Member = {
  id: number | string;
  name: string;
  plan: string;
  status: 'Active' | 'Pending' | string;
};

type Contact = {
  id: number | string;
  name: string;
  interest: string;
  message?: string;
  handled: boolean;
  createdAt: string;
};

type DashboardProps = {
  properties: Property[];
  articles: Article[];
  plans: Plan[];
  members: Member[];
  contacts: Contact[];
};

export default function Dashboard({ properties, articles, plans, members, contacts }: DashboardProps) {
  const { t, i18n } = useTranslation();
  const unread = contacts.filter((c) => !c.handled).length;
  const activeMembers = members.filter((m) => m.status === 'Active').length;

  const breadcrumbs: BreadcrumbItem[] = [
    { title: t('admin.dashboard.breadcrumb'), href: '/admin' },
  ];

  const stats = [
    {
      label: t('admin.dashboard.stats.properties'),
      value: properties.length,
      to: '/admin/properties',
      icon: Building2,
      accent: 'from-blue to-blue-dark',
      hint: t('admin.dashboard.stats.propertiesHint', { count: properties.filter((p) => p.status === 'Available').length }),
    },
    {
      label: t('admin.dashboard.stats.articles'),
      value: articles.length,
      to: '/admin/articles',
      icon: Newspaper,
      accent: 'from-navy to-blue-dark',
      hint: t('admin.dashboard.stats.articlesHint'),
    },
    {
      label: t('admin.dashboard.stats.plans'),
      value: plans.length,
      to: '/admin/plans',
      icon: Wallet,
      accent: 'from-gold-dark to-gold',
      hint: t('admin.dashboard.stats.plansHint', { count: plans.filter((p) => p.highlight).length }),
    },
    {
      label: t('admin.dashboard.stats.members'),
      value: members.length,
      to: '/admin/members',
      icon: Users,
      accent: 'from-blue to-navy',
      hint: t('admin.dashboard.stats.membersHint', { count: activeMembers }),
    },
  ];

  const recentContacts = contacts.slice(0, 4);
  const recentMembers = members.slice(0, 4);
  const dateLocale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  return (
    <>
      <Head title={t('admin.dashboard.title')} />

      <div className="space-y-10 p-4">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">
              {t('admin.dashboard.overview')} ·{' '}
              {new Date().toLocaleDateString(dateLocale, { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold leading-[1.05] tracking-tight">
              {t('admin.dashboard.welcomeBack')}<span className="text-gradient-blue">.</span>
            </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              {t('admin.dashboard.subtitle')}
            </p>
          </div>
          <Link
            href="/admin/contacts"
            className="group relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-4 shadow-card-soft hover:shadow-elegant transition"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold-dark">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t('admin.dashboard.contactInbox')}</div>
                <div className="font-display text-lg font-bold leading-none">
                  {unread} <span className="text-sm font-normal text-muted-foreground">{t('admin.dashboard.new')}</span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition ml-2" />
            </div>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              href={s.to}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 hover:shadow-elegant hover:-translate-y-0.5 transition-all"
            >
              <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.accent} opacity-10 group-hover:opacity-20 transition`} />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${s.accent} text-white shadow-glow`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <div className="font-display text-4xl font-bold tracking-tight">{s.value}</div>
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div className="mt-1 text-sm font-medium">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.hint}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Two-column: recent activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <div className="font-display text-lg font-semibold">{t('admin.dashboard.recentMessages.title')}</div>
                <div className="text-xs text-muted-foreground">{t('admin.dashboard.recentMessages.subtitle')}</div>
              </div>
              <Link href="/admin/contacts" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                {t('admin.dashboard.recentMessages.viewInbox')} <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {recentContacts.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">{t('admin.dashboard.recentMessages.empty')}</div>
            ) : (
              <ul className="divide-y divide-border">
                {recentContacts.map((c) => (
                  <li key={c.id} className="px-6 py-4 flex items-start gap-4 hover:bg-muted/30 transition">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${c.handled ? 'bg-muted-foreground/30' : 'bg-gold'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium truncate">{c.name}</span>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {c.interest}
                        </span>
                      </div>
                      {c.message && (
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{c.message}</p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {new Date(c.createdAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' })}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card overflow-hidden">
            <div className="px-6 py-5 border-b border-border">
              <div className="font-display text-lg font-semibold">{t('admin.dashboard.newMembers.title')}</div>
              <div className="text-xs text-muted-foreground">{t('admin.dashboard.newMembers.subtitle')}</div>
            </div>
            {recentMembers.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">{t('admin.dashboard.newMembers.empty')}</div>
            ) : (
              <ul className="divide-y divide-border">
                {recentMembers.map((m) => (
                  <li key={m.id} className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-blue text-white text-xs font-bold shrink-0">
                        {m.name
                          .split('admin. ')
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase() || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{m.name || t('admin.dashboard.newMembers.unnamed')}</div>
                        <div className="text-xs text-muted-foreground truncate">{m.plan}</div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          m.status === 'Active'
                            ? 'bg-emerald-500/15 text-emerald-700'
                            : m.status === 'Pending'
                            ? 'bg-amber-500/15 text-amber-700'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick tips */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-navy text-white p-8 md:p-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(500px 250px at 90% 0%, rgba(255,210,26,0.18), transparent), radial-gradient(400px 300px at 0% 100%, rgba(18,152,194,0.35), transparent)',
            }}
          />
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] items-end">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">{t('admin.dashboard.tips.label')}</div>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-semibold max-w-lg">
                {t('admin.dashboard.tips.title')}
              </h2>
              <ul className="mt-4 space-y-1.5 text-sm text-white/70 max-w-xl">
                <li>• {t('admin.dashboard.tips.tip1')}</li>
                <li>
                  •{' '}
                  <span
                    dangerouslySetInnerHTML={{
                      __html: t('admin.dashboard.tips.tip2', { siteContent: `<span class="text-gold">${t('admin.dashboard.tips.siteContent')}</span>` }),
                    }}
                  />
                </li>
                <li>• {t('admin.dashboard.tips.tip3')}</li>
              </ul>
            </div>
            <Link
              href="/admin/content"
              className="inline-flex items-center gap-2 rounded-full bg-gold text-navy font-semibold px-6 py-3 text-sm hover:bg-gold-dark transition shrink-0"
            >
              {t('admin.dashboard.tips.editButton')} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}