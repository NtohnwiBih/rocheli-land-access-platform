import { type FieldSchema } from '@/types';
import { AdminField, inputCls } from '@/components/admin/ui';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';

type Props = {
  field: FieldSchema;
  value: any;
  onChange: (value: any) => void;
};

export function SectionField({ field, value, onChange }: Props) {
  if (field.type === 'text') {
    return (
      <AdminField label={field.label}>
        <input className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </AdminField>
    );
  }

  if (field.type === 'textarea') {
    return (
      <AdminField label={field.label}>
        <textarea rows={3} className={inputCls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </AdminField>
    );
  }

  if (field.type === "image") {
    return <ImageField label={field.label} value={value} onChange={onChange} />;
  }

  const items: any[] = Array.isArray(value) ? value : [];

  const updateItem = (index: number, itemKey: string, itemValue: any) => {
    const next = [...items];
    next[index] = { ...next[index], [itemKey]: itemValue };
    onChange(next);
  };

  const addItem = () => {
    const blank = Object.fromEntries(field.itemFields.map((f) => [f.key, '']));
    onChange([...items, blank]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        {field.label}
      </span>
      <div className="mt-2 space-y-4">
        {items.map((item, index) => (
          <div key={index} className="rounded-2xl border border-border p-4 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">
                {field.itemLabel} {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="text-muted-foreground hover:text-destructive transition"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {field.itemFields.map((sub) => (
                <div key={sub.key} className={sub.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <SectionField
                    field={sub}
                    value={item[sub.key]}
                    onChange={(v) => updateItem(index, sub.key, v)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="rounded-full">
          <Plus className="h-3.5 w-3.5" /> Add {field.itemLabel.toLowerCase()}
        </Button>
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    if (value) formData.append("previous_url", value);

    try {
      const res = await fetch("/rocheli/content/upload-image", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? "",
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onChange(data.url);
    } catch {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img src={value} alt={label} className="h-40 w-full object-cover" />
          <div className="flex items-center justify-between gap-2 border-t border-border bg-card p-2 text-xs">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-destructive hover:text-destructive/80"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-sm text-muted-foreground transition hover:border-primary hover:bg-muted/50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Upload className="h-6 w-6" />
              <span className="font-medium text-foreground">Click to upload image</span>
              <span className="text-xs">PNG or JPG — up to 5 MB</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}