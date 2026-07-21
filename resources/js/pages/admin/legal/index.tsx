import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import { Save, ChevronRight, FileText, Upload } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DocumentEntry = {
  key: string;
  title_en: string;
  title_fr: string;
  file_en: string | null;
  file_fr: string | null;
  version: number;
};

interface Props {
  documents: DocumentEntry[];
}

export default function LegalDocumentsAdmin({ documents }: Props) {
  const [activeKey, setActiveKey] = useState<string>(documents[0]?.key ?? "");
  const [saved, setSaved] = useState<string | null>(null);
  const active = documents.find((d) => d.key === activeKey);

  const { data, setData, post, processing, errors, transform } = useForm({
    title_en: active?.title_en ?? "",
    title_fr: active?.title_fr ?? "",
    file_en: null as File | null,
    file_fr: null as File | null,
  });

  const selectDocument = (doc: DocumentEntry) => {
    setActiveKey(doc.key);
    setData({
      title_en: doc.title_en,
      title_fr: doc.title_fr,
      file_en: null,
      file_fr: null,
    });
  };

  const submit = () => {
    if (!active) return;
    transform((d) => ({ ...d, _method: "PUT" }));
    post(`/rocheli/legal/${active.key}`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setSaved(active.key);
        setTimeout(() => setSaved(null), 2000);
      },
    });
  };

  return (
    <>
      <Head title="Legal documents" />

      <div>
        <AdminPageHeader
          title="Legal documents"
          description="Upload the Terms & Conditions and Privacy Policy PDFs shown to members, in English and French."
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] items-start">
          <nav className="rounded-2xl border border-border bg-card p-2 lg:sticky lg:top-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-sm font-semibold">Documents</h3>
              <span className="text-xs text-muted-foreground">{documents.length} total</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {documents.map((doc) => {
                const isActive = doc.key === activeKey;
                return (
                  <button
                    key={doc.key}
                    onClick={() => selectDocument(doc)}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                      isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted/60"
                    }`}
                  >
                    <ChevronRight className={`h-3.5 w-3.5 shrink-0 transition-opacity ${isActive ? "opacity-100" : "opacity-40"}`} />
                    <span className="truncate">{doc.title_en}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {active && (
            <section className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl font-semibold">{active.title_en}</h2>
                  <p className="text-xs text-muted-foreground">Version {active.version}</p>
                </div>
                <Button onClick={submit} disabled={processing} size="sm" className="bg-gradient-blue text-white rounded-full">
                  <Save className="h-3.5 w-3.5" /> {processing ? "Saving…" : saved === active.key ? "Saved" : "Save"}
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title (EN)</Label>
                  <Input value={data.title_en} onChange={(e) => setData("title_en", e.target.value)} />
                  {errors.title_en && <p className="text-xs text-destructive">{errors.title_en}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Title (FR)</Label>
                  <Input value={data.title_fr} onChange={(e) => setData("title_fr", e.target.value)} />
                  {errors.title_fr && <p className="text-xs text-destructive">{errors.title_fr}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <PdfSlot
                  label="English PDF"
                  currentUrl={active.file_en}
                  onChange={(f) => setData("file_en", f)}
                />
                <PdfSlot
                  label="French PDF"
                  currentUrl={active.file_fr}
                  onChange={(f) => setData("file_fr", f)}
                />
              </div>
              {errors.file_en && <p className="text-xs text-destructive">{errors.file_en}</p>}
              {errors.file_fr && <p className="text-xs text-destructive">{errors.file_fr}</p>}
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function PdfSlot({
  label,
  currentUrl,
  onChange,
}: {
  label: string;
  currentUrl: string | null;
  onChange: (file: File | null) => void;
}) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    setFileName(file?.name ?? null);
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {currentUrl && !fileName && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5 text-sm text-primary hover:underline"
        >
          <FileText className="h-4 w-4" /> View current PDF
        </a>
      )}
      <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-muted/30 p-5 text-center text-xs text-muted-foreground transition hover:border-primary hover:bg-muted/50">
        <Upload className="h-5 w-5" />
        <span className="font-medium text-foreground">
          {fileName ?? (currentUrl ? "Replace PDF" : "Upload PDF")}
        </span>
        <span>PDF — up to 10 MB</span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}