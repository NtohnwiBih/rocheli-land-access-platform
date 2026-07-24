import { Head, Link } from "@inertiajs/react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  User,
  Clock,
  Share2,
  Check,
  Link2,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ArticleDetail = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string | null;
  readTime: string | null;
  image: string | null;
  date: string | null;
};

type RelatedArticle = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string | null;
  readTime: string | null;
  image: string | null;
  date: string | null;
};

type Props = {
  article: ArticleDetail;
  related: RelatedArticle[];
};

export default function ArticleShow({ article, related }: Props) {
  const { t } = useTranslation();
  const [justCopied, setJustCopied] = useState(false);

  // Built fresh each render off window.location.href rather than stored in
  // state — the URL doesn't change while this page is mounted, so there's
  // no need to track it separately.
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = article.excerpt || article.title;

  const shareTargets = [
    {
      key: "whatsapp",
      label: t("resources.article.shareVia.whatsapp", "WhatsApp"),
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${article.title} — ${shareUrl}`)}`,
    },
    {
      key: "facebook",
      label: t("resources.article.shareVia.facebook", "Facebook"),
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      key: "x",
      label: t("resources.article.shareVia.x", "X (Twitter)"),
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      key: "linkedin",
      label: t("resources.article.shareVia.linkedin", "LinkedIn"),
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      key: "email",
      label: t("resources.article.shareVia.email", "Email"),
      icon: Mail,
      href: `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
    },
  ];

  const openShareTarget = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setJustCopied(true);
      toast.success(t("resources.article.linkCopied", "Link copied to clipboard"));
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      toast.error(t("resources.article.copyFailed", "Couldn't copy the link. Select and copy it from your browser's address bar instead."));
    }
  };

  return (
    <>
      <Head title={`${article.title} — Rocheli Real Properties`}>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        {article.image && <meta property="og:image" content={article.image} />}
      </Head>

      {/* Hero */}
      <section className="relative">
        <div className="relative aspect-[16/7] min-h-[320px] w-full overflow-hidden bg-navy">
          {article.image && (
            <img src={article.image} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-navy/20" />
          <div
            className="absolute inset-0 pointer-events-none opacity-60"
            style={{
              background:
                "radial-gradient(40% 60% at 85% 0%, rgba(255,210,26,0.18), transparent 60%), radial-gradient(40% 60% at 5% 100%, rgba(18,152,194,0.25), transparent 60%)",
            }}
          />

          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container-x pb-10 md:pb-14 text-white">
              <Link
                href="/resources"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> {t("resources.article.backToResources", "Back to resources")}
              </Link>

              <span className="mt-5 inline-block rounded-full bg-white/15 backdrop-blur-md border border-white/25 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest">
                {article.category}
              </span>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 max-w-3xl font-display text-3xl md:text-5xl font-semibold leading-[1.08] tracking-tight"
              >
                {article.title}
              </motion.h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                {article.author && (
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gold" /> {article.author}
                  </span>
                )}
                {article.date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gold" /> {article.date}
                  </span>
                )}
                {article.readTime && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-gold" /> {article.readTime}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_280px]">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            {article.excerpt && (
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground font-medium">
                {article.excerpt}
              </p>
            )}

            <div
              className="prose-rocheli mt-8 max-w-none text-[15px] leading-[1.85] text-foreground/90"
              dangerouslySetInnerHTML={{ __html: article.body }}
            />

            <div className="mt-12 flex items-center justify-between rounded-2xl border border-border bg-card p-5">
              <div className="text-sm text-muted-foreground">
                {t("resources.article.foundUseful", "Found this useful?")}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold hover:border-primary/40 hover:text-primary transition">
                    <Share2 className="h-3.5 w-3.5" /> {t("resources.article.share", "Share this article")}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                    {t("resources.article.shareTitle", "Share via")}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {shareTargets.map((target) => (
                    <DropdownMenuItem
                      key={target.key}
                      onClick={() => openShareTarget(target.href)}
                      className="gap-2.5"
                    >
                      <target.icon className="h-4 w-4 text-muted-foreground" />
                      {target.label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copyLink} className="gap-2.5">
                    {justCopied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        {t("resources.article.copied", "Copied")}
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4 text-muted-foreground" />
                        {t("resources.article.copyLink", "Copy link")}
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.article>

          {/* Sidebar CTA */}
          <aside className="lg:sticky lg:top-28 h-fit">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-navy text-white p-7 grain">
              <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                  background: "radial-gradient(60% 60% at 90% 0%, rgba(255,210,26,0.2), transparent 60%)",
                }}
              />
              <div className="relative">
                <h3 className="font-display text-xl font-semibold leading-snug">
                  {t("resources.article.ctaTitle", "Ready to talk to an advisor?")}
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  {t("resources.article.ctaBody", "Book a free 30-minute consultation and get a plan tailored to your goals.")}
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-gold text-navy h-11 text-sm font-semibold hover:opacity-95 transition"
                >
                  {t("resources.article.ctaButton", "Book a consultation")} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="py-16 bg-muted/40 border-t border-border">
          <div className="container-x">
            <h2 className="font-display text-2xl font-semibold">
              {t("resources.article.keepReading", "Keep reading")}
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={`/resources/${a.slug}`}
                    className="group block rounded-3xl overflow-hidden bg-card border border-border hover:shadow-elegant transition-all"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      {a.image && (
                        <img
                          src={a.image}
                          alt={a.title}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-semibold uppercase tracking-widest text-primary">{a.category}</div>
                      <h3 className="mt-3 font-display text-lg font-semibold leading-snug">{a.title}</h3>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-gold">
                        {t("resources.article.read", "Read")} <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}