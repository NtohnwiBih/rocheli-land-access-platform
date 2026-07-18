export type Locale = 'en' | 'fr';

export type LocalizedContent<T> = {
  en: T;
  fr: T;
};

export type FieldSchema =
  | { type: 'text'; key: string; label: string }
  | { type: 'textarea'; key: string; label: string }
  | { type: 'image'; key: string; label: string }
  | { type: 'list'; key: string; label: string; itemLabel: string; itemFields: FieldSchema[] };

export type SectionSchema = {
  key: string;
  label: string;
  fields: FieldSchema[];
};