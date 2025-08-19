import type { CollectionConfig } from 'payload'

export const Header: CollectionConfig = {
  slug: 'header',
  fields: [
    {
      name: 'logo',
      type: 'text',
      label: 'Logo Text',
    },
    {
      name: 'links',
      type: 'array',
      label: 'Navigation Links',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
};

export default Header;
