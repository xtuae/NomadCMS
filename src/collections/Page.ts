import { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'About', value: 'about' },
        { label: 'Contact', value: 'contact' },
        { label: 'Privacy Policy', value: 'privacy' },
        { label: 'Community', value: 'community' },
        { label: 'Support', value: 'support' },
      ],
    },
    // --- Home ---
    {
      name: 'home_hero',
      type: 'group',
      admin: { condition: (data) => data.pageType === 'home' },
      fields: [
        { name: 'prefix_title', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'text' },
        { name: 'paragraph', type: 'textarea' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'testimonial_head', type: 'textarea', label: 'Quote' },
        { name: 'testimonial_quote', type: 'text' },
        {
          name: 'testimonials',
          type: 'array',
          label: 'Kind Testimonials',
          labels: {
            singular: 'Testimonial',
            plural: 'Testimonials',
          },
          fields: [
            { name: 'authorName', type: 'text', label: 'Author Name' },
            { name: 'authorAvatar', type: 'upload', relationTo: 'media', label: 'Author Avatar' },
          ],
        },
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Social Media Links',
          fields: [
            { name: 'platform', type: 'text', label: 'Platform (e.g. Facebook)' },
            { name: 'url', type: 'text', label: 'Profile URL' },
            {
              name: 'icon',
              type: 'select',
              label: 'Icon',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'YouTube', value: 'youtube' },
              ],
            },
          ],
        },
      ],
    },

    // --- About ---
    {
      name: 'hero',
      type: 'group',
      admin: { condition: (data) => data.pageType === 'about' },
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'textarea' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'ctaText', type: 'text' },
        { name: 'ctaLink', type: 'text' },
      ],
    },

    {
      name: 'mission',
      type: 'group',
      admin: { condition: (data) => data.pageType === 'about' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'intro', type: 'textarea' },
        {
          name: 'circles',
          type: 'array',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'color', type: 'text' }, // e.g. purple, green, yellow
          ],
        },
      ],
    },

    {
      name: 'mission_last',
      type: 'text',
      admin: { condition: (data) => data.pageType === 'about' },
    },
    {
      name: 'Section_title',
      type: 'text',
      admin: { condition: (data) => data.pageType === 'about' },
    },
    {
      name: 'title_describtion',
      type: 'text',
      admin: { condition: (data) => data.pageType === 'about' },
    },

    {
      name: 'whatWeDo',
      type: 'array',
      admin: { condition: (data) => data.pageType === 'about' },
      fields: [
        { name: 'icon', type: 'text' }, // lucide icon name
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'color', type: 'text' }, // optional
      ],
    },

    // --- Contact ---
    {
      name: 'Contact_hero',
      type: 'group',
      admin: { condition: (data) => data.pageType === 'contact' },
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'textarea' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: { condition: (data) => data.pageType === 'contact' },
    },
    {
      name: 'contactPhone',
      type: 'text',
      admin: { condition: (data) => data.pageType === 'contact' },
    },
    {
      name: 'contactAddress',
      type: 'textarea',
      admin: { condition: (data) => data.pageType === 'contact' },
    },

    // --- Privacy ---
    {
      name: 'privacyHeader',
      type: 'group',
      admin: { condition: (data) => data.pageType === 'privacy' },
      fields: [
        { name: 'headline', type: 'text' },
        { name: 'subheadline', type: 'textarea' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'privacyText',
      type: 'richText',
      admin: { condition: (data) => data.pageType === 'privacy' },
    },

    // --- Community ---
    {
      name: 'communityIntro',
      type: 'richText',
      admin: { condition: (data) => data.pageType === 'community' },
    },
    {
      name: 'communityLinks',
      type: 'array',
      admin: { condition: (data) => data.pageType === 'community' },
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
    },

    // --- Support ---
    {
      name: 'main_banner',
      type: 'group',
      admin: { condition: (data) => data.pageType === 'support' },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      admin: { condition: (data) => data.pageType === 'support' },

      labels: { singular: 'FAQ', plural: 'FAQs' },
      fields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'textarea' },
      ],
    },
    {
      name: 'contacts',
      type: 'array',
      admin: { condition: (data) => data.pageType === 'support' },

      labels: { singular: 'Contact', plural: 'Contacts' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'email', type: 'text' },
      ],
    },
    {
      name: 'address',
      type: 'group',
      admin: { condition: (data) => data.pageType === 'support' },
      fields: [
        { name: 'company', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'phone', type: 'text' },
      ],
    },
  ],
}
