import { Head, router, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Save, ChevronRight, ArrowLeft, ImageIcon } from 'lucide-react';
import { type Locale } from '@/types';
import { AdminPageHeader } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ArticleData = {
  id: number;
  slug: string;
  title_en: string;
  title_fr: string;
  excerpt_en: string;
  excerpt_fr: string;
  body_en: string;
  body_fr: string;
  category_id: number;
  author: string | null;
  read_time: string | null;
  image: string | null;
  published_at: string | null;
  is_published: boolean;
} | null;

type CategoryOption = { id: number; name_en: string };

interface Props {
  article: ArticleData;
  categories: CategoryOption[];
}

const sections = [
  { key: 'details', label: 'Details' },
  { key: 'content', label: 'Content' },
  { key: 'media', label: 'Media' },
  { key: 'publishing', label: 'Publishing' },
] as const;

type SectionKey = (typeof sections)[number]['key'];

export default function ArticleForm({ article, categories }: Props) {
  const editing = !!article;

  const [locale, setLocale] = useState<Locale>('en');
  const [activeSection, setActiveSection] = useState<SectionKey>('details');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(article?.image ?? null);

const { data, setData, post, processing, errors, transform } = useForm({
    slug: article?.slug ?? '',
    title_en: article?.title_en ?? '',
    title_fr: article?.title_fr ?? '',
    excerpt_en: article?.excerpt_en ?? '',
    excerpt_fr: article?.excerpt_fr ?? '',
    body_en: article?.body_en ?? '',
    body_fr: article?.body_fr ?? '',
    category_id: article?.category_id ?? null,
    author: article?.author ?? '',
    read_time: article?.read_time ?? '',
    published_at: article?.published_at ?? '',
    is_published: article?.is_published ?? true,
    image: null as File | null,
  });

  const handleImage = (file: File | null) => {
    setData('image', file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const submit = () => {
    setSaving(true);

    const options = {
      forceFormData: true as const,
      preserveScroll: true,
      onFinish: () => setSaving(false),
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    };

    if (editing) {
      transform((d) => ({ ...d, _method: 'PUT' }));
      post(`/rocheli/articles/${article!.id}`, options);
    } else {
      post('/rocheli/articles', options);
    }
  };

  return (
    <>
      <Head title={editing ? 'Edit article' : 'New article'} />

      <div>
        <AdminPageHeader
          title={editing ? 'Edit article' : 'New article'}
          description="Bilingual blog post shown in Articles and Resources. Changes go live immediately after saving."
          action={
            <div className="flex items-center gap-3">
              <Link href="/rocheli/articles">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              </Link>
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
            </div>
          }
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr] items-start">
          {/* Sidebar */}
          <nav className="border border-border bg-card p-2 lg:sticky lg:top-4">
            <div className="flex items-center justify-between px-4 py-2">
              <h3 className="text-sm font-semibold">Sections</h3>
              <span className="text-xs text-muted-foreground">{sections.length} total</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {sections.map((section) => {
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

          {/* Active section form */}
          <section className="border border-border bg-card p-6 md:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">
                {sections.find((s) => s.key === activeSection)?.label}
              </h2>
              <Button
                onClick={submit}
                disabled={saving || processing}
                size="sm"
                className="bg-gradient-blue text-white rounded-full"
              >
                <Save className="h-3.5 w-3.5" />
                {saving || processing ? 'Saving…' : saved ? 'Saved' : editing ? 'Update' : 'Create'}
              </Button>
            </div>

            {activeSection === 'details' && (
            <div className="grid gap-4 sm:grid-cols-2">
                {editing && (
                <div className="space-y-2 sm:col-span-2">
                    <Label>Slug</Label>
                    <Input
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="auto-generated-from-title"
                    />
                    <p className="text-xs text-muted-foreground">
                    Changing this will change the article's public URL. Leave as-is unless you have a specific reason to update it.
                    </p>
                    {errors.slug && <p className="text-xs text-destructive">{errors.slug}</p>}
                </div>
                )}

                <div className="space-y-2">
                    <Label>Author</Label>
                    <Input value={data.author} onChange={(e) => setData('author', e.target.value)} />
                </div>

                {locale === 'en' ? (
                <>
                    <div className="space-y-2">
                        <Label>Title (EN)</Label>
                        <Input value={data.title_en} onChange={(e) => setData('title_en', e.target.value)} />
                        {errors.title_en && <p className="text-xs text-destructive">{errors.title_en}</p>}
                        {!editing && data.title_en && (
                            <p className="text-xs text-muted-foreground">
                            URL will be: <span className="font-mono">/resources/{slugify(data.title_en)}</span>
                            </p>
                        )}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                       <Label>Category</Label>
                        <Select
                            value={data.category_id ? String(data.category_id) : undefined}
                            onValueChange={(v) => setData('category_id', Number(v))}
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>{c.name_en}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-xs text-destructive">{errors.category_id}</p>}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                    <Label>Excerpt (EN)</Label>
                    <Textarea rows={3} value={data.excerpt_en} onChange={(e) => setData('excerpt_en', e.target.value)} />
                    </div>
                </>
                ) : (
                <>
                    <div className="space-y-2">
                    <Label>Title (FR)</Label>
                    <Input value={data.title_fr} onChange={(e) => setData('title_fr', e.target.value)} />
                    {errors.title_fr && <p className="text-xs text-destructive">{errors.title_fr}</p>}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                       <Label>Category</Label>
                        <Select
                            value={data.category_id ? String(data.category_id) : undefined}
                            onValueChange={(v) => setData('category_id', Number(v))}
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                            {categories.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>{c.name_en}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && <p className="text-xs text-destructive">{errors.category_id}</p>}
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                    <Label>Excerpt (FR)</Label>
                    <Textarea rows={3} value={data.excerpt_fr} onChange={(e) => setData('excerpt_fr', e.target.value)} />
                    </div>
                </>
                )}
            </div>
            )}

            {activeSection === 'content' && (
                <div className="space-y-2">
                    <Label>Body ({locale.toUpperCase()})</Label>
                    {locale === 'en' ? (
                    <RichTextEditor value={data.body_en} onChange={(html) => setData('body_en', html)} />
                    ) : (
                    <RichTextEditor value={data.body_fr} onChange={(html) => setData('body_fr', html)} />
                    )}
                    <p className="text-xs text-muted-foreground">
                    Switch the EN / FR toggle above to edit the other language's body text.
                    </p>
                </div>
            )}

            {activeSection === 'media' && (
              <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
                <div className="space-y-2">
                  <Label>Read time</Label>
                  <Input
                    value={data.read_time}
                    onChange={(e) => setData('read_time', e.target.value)}
                    placeholder="5 min read"
                  />
                  <p className="text-xs text-muted-foreground">
                    Shown as a small label next to the category badge on article cards.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Cover image</Label>
                  {imagePreview ? (
                    <div className="relative overflow-hidden rounded-xl border border-border">
                      <img src={imagePreview} alt="" className="h-40 w-full object-cover" />
                      <div className="flex items-center justify-between gap-2 border-t border-border bg-card p-2 text-xs">
                        <label className="flex cursor-pointer items-center gap-1 text-muted-foreground hover:text-foreground">
                          <ImageIcon className="h-3.5 w-3.5" /> Replace
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setData('image', null);
                          }}
                          className="text-destructive hover:text-destructive/80"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground transition hover:border-primary hover:bg-muted/50">
                      <ImageIcon className="h-6 w-6" />
                      <span className="font-medium text-foreground">Click to upload cover image</span>
                      <span className="text-xs">PNG or JPG — up to 5 MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImage(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  )}
                  {errors.image && <p className="text-xs text-destructive">{errors.image}</p>}
                </div>
              </div>
            )}

            {activeSection === 'publishing' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Published date</Label>
                  <Input
                    type="date"
                    value={data.published_at}
                    onChange={(e) => setData('published_at', e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex w-full items-center justify-between rounded-xl border border-border p-3">
                    <Label className="cursor-pointer">Published</Label>
                    <Switch checked={data.is_published} onCheckedChange={(v) => setData('is_published', v)} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}