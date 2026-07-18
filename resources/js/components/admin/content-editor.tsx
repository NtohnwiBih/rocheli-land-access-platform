import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Save, ChevronRight } from 'lucide-react';
import { type Locale } from '@/types';
import { findPage } from '@/components/admin/content-schemas';
import { SectionField } from '@/components/admin/section-field';
import { AdminPageHeader } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';

type ContentPayload = Record<string, { en: Record<string, any>; fr: Record<string, any> }>;

type Props = {
  page: string;
  content: ContentPayload;
};

export function ContentEditor({ page, content: initialContent }: Props) {
  const pageDef = findPage(page);

  const [content, setContent] = useState<ContentPayload>(initialContent);
  const [locale, setLocale] = useState<Locale>('en');
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>(pageDef?.sections[0]?.key ?? '');

  if (!pageDef) {
    return (
      <>
        <Head title="Site content" />
        <div className="p-8 text-center text-muted-foreground">
          Unknown content page: <span className="font-mono">{page}</span>
        </div>
      </>
    );
  }

  function updateField(sectionKey: string, fieldKey: string, value: any) {
    setContent((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [locale]: {
          ...prev[sectionKey]?.[locale],
          [fieldKey]: value,
        },
      },
    }));
  }

  function saveSection(sectionKey: string) {
    setSaving(sectionKey);
    router.put(
      `/rocheli/content/${page}`,
      {
        section: sectionKey,
        en: content[sectionKey]?.en ?? {},
        fr: content[sectionKey]?.fr ?? {},
      },
      {
        preserveScroll: true,
        onFinish: () => setSaving(null),
        onSuccess: () => {
          setSaved(sectionKey);
          setTimeout(() => setSaved(null), 2000);
        },
      },
    );
  }

  const currentSection = pageDef.sections.find((s) => s.key === activeSection);
  const textFields = currentSection?.fields.filter((f) => f.type !== 'image') ?? [];
  const imageFields = currentSection?.fields.filter((f) => f.type === 'image') ?? [];

  return (
    <>
      <Head title={`${pageDef.label} content`} />

      <div>
        <AdminPageHeader
          title={`${pageDef.label} content`}
          description="Edit every section of this page in English and French. Changes go live immediately after saving."
          action={
            <div className="inline-flex rounded-full border border-border bg-muted p-1">
              {(['en', 'fr'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase transition ${
                    locale === l ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          }
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] items-start">
          <nav className="rounded-2xl border border-border bg-card p-2 lg:sticky lg:top-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-sm font-semibold">Sections</h3>
              <span className="text-xs text-muted-foreground">{pageDef.sections.length} total</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {pageDef.sections.map((section) => {
                const isActive = section.key === activeSection;
                return (
                  <div key={section.key} className="group flex items-center gap-1 rounded-lg hover:bg-muted/60">
                    <button
                      onClick={() => setActiveSection(section.key)}
                      className={`flex flex-1 items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-sm transition ${
                        isActive ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <ChevronRight
                        className={`h-3.5 w-3.5 shrink-0 transition-opacity ${
                          isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-60'
                        }`}
                      />
                      <span className="truncate">{section.label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </nav>

          {currentSection && (
            <section className="rounded-3xl border border-border bg-card p-6 md:p-8 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">{currentSection.label}</h2>
                <Button
                  onClick={() => saveSection(currentSection.key)}
                  disabled={saving === currentSection.key}
                  size="sm"
                  className="bg-gradient-blue text-white rounded-full"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving === currentSection.key
                    ? 'Saving…'
                    : saved === currentSection.key
                    ? 'Saved'
                    : 'Save'}
                </Button>
              </div>

              <div className={`grid gap-6 ${imageFields.length > 0 ? 'md:grid-cols-[1.3fr_1fr]' : ''}`}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {textFields.map((field) => (
                    <div key={field.key} className={field.type !== 'text' ? 'sm:col-span-2' : ''}>
                      <SectionField
                        field={field}
                        value={content[currentSection.key]?.[locale]?.[field.key]}
                        onChange={(v) => updateField(currentSection.key, field.key, v)}
                      />
                    </div>
                  ))}
                </div>

                {imageFields.length > 0 && (
                  <div className="space-y-4">
                    {imageFields.map((field) => (
                      <SectionField
                        key={field.key}
                        field={field}
                        value={content[currentSection.key]?.[locale]?.[field.key]}
                        onChange={(v) => updateField(currentSection.key, field.key, v)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}