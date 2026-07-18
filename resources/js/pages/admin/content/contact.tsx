import { ContentEditor } from '@/components/admin/content-editor';

type Props = { content: Record<string, { en: Record<string, any>; fr: Record<string, any> }> };

export default function ContactContent({ content }: Props) {
  return <ContentEditor page="contact" content={content} />;
}