import type { CollectionConfig } from 'payload'

export const Footer: CollectionConfig = {
  slug: 'footer',
  fields: [
    {
      name: 'copyright',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}

export default Footer
