import { Head, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import { FileText, Download, ShieldCheck } from "lucide-react";

type Document = {
  key: string;
  title: string;
  url: string | null;
  available: boolean;
};

interface PageProps {
  documents: Document[];
  [key: string]: unknown;
}

const icons: Record<string, typeof FileText> = {
  member_agreement: FileText,
  privacy_policy: ShieldCheck,
};

export default function LegalDocuments() {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const { documents } = props;

  return (
    <>
      <Head title={t("admin.legalDocuments.pageTitle")} />

      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-black md:text-3xl">{t("admin.legalDocuments.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("admin.legalDocuments.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {documents.map((doc) => {
            const Icon = icons[doc.key] ?? FileText;

            return (
              <div key={doc.key} className="rounded-3xl bg-card p-6 shadow-card">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-rocheli-blue/10 text-rocheli-blue">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold">{doc.title}</h3>

                {doc.available ? (
                  <a
                    href={doc.url!}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rocheli-blue px-4 py-2 text-sm font-semibold text-white hover:bg-rocheli-blue/90"
                  >
                    <Download className="h-3.5 w-3.5" /> {t("admin.legalDocuments.viewPdf")}
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">{t("admin.legalDocuments.notAvailable")}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}