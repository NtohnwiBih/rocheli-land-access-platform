import { type SectionSchema } from '@/types';

export type PageKey ='global' | 'home' | 'about' | 'services' | 'land-club' | 'resources' | 'contact';

export type PageDefinition = {
  key: PageKey;
  label: string;
  sections: SectionSchema[];
};

export const pageSchemas: PageDefinition[] = [
  {
    key: 'global',
    label: 'Global',
    sections: [
      {
        key: 'footer',
        label: 'Footer',
        fields: [
          { type: 'textarea', key: 'description', label: 'Company description' },
          { type: 'text', key: 'phone', label: 'Phone' },
          { type: 'text', key: 'email', label: 'Email' },
          { type: 'text', key: 'address', label: 'Address' },
          { type: 'text', key: 'facebookUrl', label: 'Facebook URL' },
          { type: 'text', key: 'instagramUrl', label: 'Instagram URL' },
          { type: 'text', key: 'linkedinUrl', label: 'LinkedIn URL' },
          { type: 'text', key: 'twitterUrl', label: 'Twitter/X URL' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // HOME
  // ─────────────────────────────────────────────────────────
  {
    key: 'home',
    label: 'Home',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { type: 'text', key: 'badge', label: 'Badge text' },
          { type: 'text', key: 'titleLine1', label: 'Title line 1' },
          { type: 'text', key: 'titleLine2', label: 'Title line 2' },
          { type: 'text', key: 'titleAccent', label: 'Title accent (italic gold)' },
          { type: 'textarea', key: 'subtitle', label: 'Subtitle' },
          { type: 'text', key: 'ctaPrimaryLabel', label: 'Primary CTA label' },
          { type: 'text', key: 'ctaSecondaryLabel', label: 'Secondary CTA label' },
          { type: 'text', key: 'ctaPrimaryUrl', label: 'Primary button link'},
          { type: 'text', key: 'ctaSecondaryUrl', label: 'Secondary button link'},
          { type: 'text', key: 'watchStoryLabel', label: 'Watch story label' },
          { type: 'text', key: 'statMembersLabel', label: 'Members stat label' },
          { type: 'text', key: 'statPropertiesLabel', label: 'Properties stat label' },
          { type: 'text', key: 'statContributionsLabel', label: 'Contributions stat label' },
          { type: 'image', key: 'heroImage', label: 'Background image' },
        ],
      },
      {
        key: 'stats',
        label: 'Stats',
        fields: [
          { type: 'text', key: 'statMembersValue', label: 'Members stat value (number)' },
          { type: 'text', key: 'statMembersLabel', label: 'Members stat label' },

          { type: 'text', key: 'statPropertiesAllocatedValue', label: 'Properties allocated value (number)' },
          { type: 'text', key: 'statPropertiesAllocatedLabel', label: 'Properties allocated stat label' },

          { type: 'text', key: 'statAcresValue', label: 'Acres value (number)' },
          { type: 'text', key: 'statAcresLabel', label: 'Acres stat label' },

          { type: 'text', key: 'statContributionsValue', label: 'Contributions value (e.g. 2.5)' },
          { type: 'text', key: 'statContributionsLabel', label: 'Contributions stat label' },
        ],
      },
      {
        key: 'whyRocheli',
        label: 'Why Rocheli',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'subtitle', label: 'Subtitle' },
          {
            type: 'list',
            key: 'features',
            label: 'Feature cards',
            itemLabel: 'Feature',
            itemFields: [
              { type: 'text', key: 'icon', label: 'Icon name (lucide-react)' },
              { type: 'text', key: 'title', label: 'Title' },
              { type: 'textarea', key: 'description', label: 'Description' },
            ],
          },
        ],
      },
      {
        key: 'savingsProgram',
        label: 'Savings program banner',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'subtitle', label: 'Subtitle' },
          {
            type: 'list',
            key: 'features',
            label: 'Bullet points',
            itemLabel: 'Bullet',
            itemFields: [{ type: 'text', key: 'text', label: 'Text' }],
          },
          { type: 'text', key: 'ctaLabel', label: 'Primary CTA label' },
          { type: 'text', key: 'secondaryCtaLabel', label: 'Secondary CTA label' },
          { type: 'text', key: 'cohortLabel', label: 'Cohort badge text' },
          { type: 'image', key: 'image', label: 'Photo' },
        ],
      },
      {
        key: 'steps',
        label: 'How it works',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          {
            type: 'list',
            key: 'steps',
            label: 'Steps',
            itemLabel: 'Step',
            itemFields: [
              { type: 'text', key: 'number', label: 'Number (e.g. 01)' },
              { type: 'text', key: 'title', label: 'Title' },
              { type: 'textarea', key: 'description', label: 'Description' },
            ],
          },
        ],
      },
      {
        key: 'testimonials',
        label: 'Testimonials (section header)',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'subtitle', label: 'Subtitle' },
        ],
      },
      {
        key: 'faq',
        label: 'FAQ (section header)',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
        ],
      },
      {
        key: 'articles',
        label: 'Articles (section header)',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
        ],
      },
      {
        key: 'cta',
        label: 'Talk to an advisor',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'text', key: 'address', label: 'Address' },
          { type: 'text', key: 'phone', label: 'Phone' },
          { type: 'text', key: 'whatsapp', label: 'WhatsApp number' },
          { type: 'text', key: 'ctaLabel', label: 'CTA label' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // ABOUT
  // ─────────────────────────────────────────────────────────
  {
    key: 'about',
    label: 'About',
    sections: [
      {
        key: 'hero',
        label: 'Breadcrumb / hero',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'description', label: 'Description' },
        ],
      },
      {
        key: 'story',
        label: 'Our story',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'paragraph1', label: 'Paragraph 1' },
          { type: 'textarea', key: 'paragraph2', label: 'Paragraph 2' },
          { type: 'image', key: 'image', label: 'Photo' },
        ],
      },
      {
        key: 'mission',
        label: 'Mission / Vision / Values',
        fields: [
          {
            type: 'list',
            key: 'values',
            label: 'Cards',
            itemLabel: 'Card',
            itemFields: [
              { type: 'text', key: 'icon', label: 'Icon name (lucide-react)' },
              { type: 'text', key: 'title', label: 'Title' },
              { type: 'textarea', key: 'body', label: 'Body' },
            ],
          },
        ],
      },
      {
        key: 'leadership',
        label: 'Leadership (section header)',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'textarea', key: 'description', label: 'Description' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // SERVICES
  // ─────────────────────────────────────────────────────────
  {
    key: 'services',
    label: 'Services',
    sections: [
      {
        key: 'hero',
        label: 'Breadcrumb / hero',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'description', label: 'Description' },
        ],
      },
      {
        key: 'list',
        label: 'Service cards',
        fields: [
          {
            type: 'list',
            key: 'items',
            label: 'Services',
            itemLabel: 'Service',
            itemFields: [
              { type: 'text', key: 'icon', label: 'Icon name (lucide-react)' },
              { type: 'text', key: 'title', label: 'Title' },
              { type: 'textarea', key: 'body', label: 'Description' },
              {
                type: 'list',
                key: 'points',
                label: 'Bullet points',
                itemLabel: 'Point',
                itemFields: [{ type: 'text', key: 'text', label: 'Text' }],
              },
            ],
          },
        ],
      },
      {
        key: 'cta',
        label: 'Bottom CTA banner',
        fields: [
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'text', key: 'ctaPrimaryLabel', label: 'Primary CTA label' },
          { type: 'text', key: 'ctaSecondaryLabel', label: 'Secondary CTA label' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // LAND ACCESS CLUB
  // ─────────────────────────────────────────────────────────
  {
    key: 'land-club',
    label: 'Land Access Club',
    sections: [
      {
        key: 'hero',
        label: 'Hero',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'description', label: 'Description' },
          { type: 'text', key: 'ctaPrimaryLabel', label: 'Primary CTA label' },
          { type: 'text', key: 'ctaSecondaryLabel', label: 'Secondary CTA label' },
        ],
      },
      {
        key: 'benefits',
        label: 'Why join (section header)',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          {
            type: 'list',
            key: 'items',
            label: 'Benefit cards',
            itemLabel: 'Benefit',
            itemFields: [
              { type: 'text', key: 'icon', label: 'Icon name (lucide-react)' },
              { type: 'text', key: 'title', label: 'Title' },
              { type: 'textarea', key: 'body', label: 'Description' },
            ],
          },
        ],
      },
      {
        key: 'journey',
        label: 'Membership journey',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          {
            type: 'list',
            key: 'items',
            label: 'Timeline steps',
            itemLabel: 'Step',
            itemFields: [
              { type: 'text', key: 'month', label: 'Month label (e.g. "Month 0")' },
              { type: 'text', key: 'title', label: 'Title' },
              { type: 'textarea', key: 'body', label: 'Description' },
            ],
          },
        ],
      },
      {
        key: 'eligibility',
        label: 'Eligibility',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          {
            type: 'list',
            key: 'requirements',
            label: 'Requirements',
            itemLabel: 'Requirement',
            itemFields: [{ type: 'text', key: 'text', label: 'Text' }],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // RESOURCES
  // ─────────────────────────────────────────────────────────
  {
    key: 'resources',
    label: 'Resources',
    sections: [
      {
        key: 'hero',
        label: 'Breadcrumb / hero',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'description', label: 'Description' },
        ],
      },
      {
        key: 'featured',
        label: 'Featured (section header)',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
        ],
      },
      {
        key: 'articles',
        label: 'Latest articles (section header)',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // CONTACT
  // ─────────────────────────────────────────────────────────
  {
    key: 'contact',
    label: 'Contact',
    sections: [
      {
        key: 'hero',
        label: 'Breadcrumb / hero',
        fields: [
          { type: 'text', key: 'eyebrow', label: 'Eyebrow' },
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'titleAccent', label: 'Title accent' },
          { type: 'textarea', key: 'description', label: 'Description' },
        ],
      },
      {
        key: 'form',
        label: 'Contact form panel',
        fields: [
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'textarea', key: 'subtitle', label: 'Subtitle' },
        ],
      },
      {
        key: 'booking',
        label: 'Book an advisor panel',
        fields: [
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'textarea', key: 'body', label: 'Description' },
        ],
      },
      {
        key: 'whatsapp',
        label: 'WhatsApp panel',
        fields: [
          { type: 'text', key: 'title', label: 'Title' },
          { type: 'text', key: 'subtitle', label: 'Subtitle' },
        ],
      },
      {
        key: 'offices',
        label: 'Office locations',
        fields: [
          {
            type: 'list',
            key: 'items',
            label: 'Offices',
            itemLabel: 'Office',
            itemFields: [
              { type: 'text', key: 'city', label: 'City' },
              { type: 'text', key: 'address', label: 'Address' },
              { type: 'text', key: 'phone', label: 'Phone' },
              { type: 'text', key: 'hours', label: 'Hours' },
            ],
          },
        ],
      },
    ],
  },
];

export function findPage(key: string): PageDefinition | undefined {
  return pageSchemas.find((p) => p.key === key);
}

export function pageSectionKeys(key: string): string[] {
  return findPage(key)?.sections.map((s) => s.key) ?? [];
}